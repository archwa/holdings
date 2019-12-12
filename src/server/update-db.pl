#!/usr/bin/perl -w

use Data::Dumper;
use MongoDB;

# create a client
my $client = MongoDB::MongoClient->new(
);

# connection string
my $db = $client->get_database($ENV{'FILINGS_DB'});

my $colls = $db->list_collections();
# print Dumper $colls;
my $coll_periods = $db->get_collection('holdings_staging');
my $coll_funds = $db->get_collection('filers_staging');
 
# quarters mappings
my $quarters = {
  '01'=>'q1', '02'=>'q1', '03'=>'q1',
  '04'=>'q2', '05'=>'q2', '06'=>'q2',
  '07'=>'q3', '08'=>'q3', '09'=>'q3',
  '10'=>'q4', '11'=>'q4', '12'=>'q4'
  #'0327'=>'q1','0328'=>'q1','0629'=>'q1','0330'=>'q1','0331'=>'q1', 
  #'0627'=>'q2','0628'=>'q2','0629'=>'q2','0630'=>'q2',
  #'0927'=>'q3','0928'=>'q3','0930'=>'q3','0930'=>'q3', 
  #'1227'=>'q4','1228'=>'q4','1229'=>'q4','1230'=>'q4','1231'=>'q4'
};

# create an array of all quarters of format "YYYYqQ"
# YYYY in { 2001 .. 2019 }
# Q    in { 1, 2, 3, 4 }
my @all_periods = ();
for (my $y = 2001;  $y <= 2019;  $y++) {
  for (my $q = 1;  $q < 5;  $q++) {
    push (@all_periods, "$y" . "q$q");
  }
}

# parsing 13f form (subroutine)
# what is a 13f form?
# https://www.investopedia.com/terms/f/form-13f.asp
sub parse_13f {
  my ($fn, $data, $companies) = @_;
  # open filehandler
  open (my $fh, '<:encoding(UTF-8)', $fn)
    or die "Could not open file '$filename' $!";
  my ($period, $text) = ('', 0);
  my $issuer = 0;
 
  while (<$fh>) {
    if (/CONFORMED PERIOD OF REPORT:\s+(\d+)/) {
      $period = $1;
      $period = substr ($period, 0, 4) . $quarters->{substr ($period, 4, 2)};
    } elsif (/<nameOfIssuer>([^<]+)/) {
      $issuer = $1;
    } elsif (/<cusip>([^<]+)/) {
      my $cusip = $1;
      $cusip .= '0' while 9 > length $cusip;
#      print "   cusip $cusip\n";
      $data->{$cusip}->{$period} = 1;
      $companies->{$cusip}->{'issuer'} = $issuer;
    } elsif (/^<S>/) { 
      $text = 1;
    } elsif ($text && /.*([0-9]{3}[a-zA-Z0-9]{2}[a-zA-Z0-9*@#]{3}[0-9]?).*/) {
      my $cusip = $1;
      $cusip .= '0' while 9 > length $cusip;
#      print "   cusip from text $cusip\n";
      $data->{$cusip}->{$period} = 1;
      $companies->{$cusip}->{'issuer'} = $issuer;
    }
  }
#  print "Period $period\n";
  close ($fh);
}

sub get_13f_list {
  my $cik = shift;
  my $data = {};
  my $companies = {};
  my $fn  = "data/$cik.idx";

  # create data directory
  `mkdir -p data`;

  if (! -e $fn) {
    my $url = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' . $cik . '&type=13f&dateb=&owner=exclude&count=1000';
    my $cmd = "curl --connect-timeout 60 --retry 100 --retry-delay 5 --retry-max-time 300 --retry-connrefused -o '$fn' '$url'";
    print $cmd;
    `$cmd`;
  }

  open(my $fh, '<:encoding(UTF-8)', $fn)
    or die "Could not open file '$filename' $!";
 
  while (<$fh>) {
    if (/Documents/ && /href=\"([^\"]+)/) {
      # print "$1\n";
      my $url = "https://www.sec.gov" . $1;
      $url =~ s/(-index.*)/\.txt/;
      my $of = $url;
      $of =~ s/.+edgar\/(data.+)\/(.+)/$1\/$2/;
      # $of =~ s/.+edgar\/(data.+)\/(.+)/data\/$2/;
      my $dir = $1;
      # print "$url to $of in dir $dir\n"; 
      if (! -e $of) {
        `mkdir -p $dir`;
        my $cmd = "curl --connect-timeout 60 --retry 100 --retry-delay 5 --retry-max-time 300 --retry-connrefused -o '$of' '$url'";
        print $cmd;
        `$cmd`;
      }
      parse_13f ($of, $data, $companies);
      `rm -f $of`;
      `rm -rf $dir`;
    }
  }
  close ($fh);

  # remove data directory
  `rm -rf data`;

  my @cusips = sort keys %$data;
  my @documents = ();
  my @docs_text = ();

  for my $c (@cusips) {
    my $quarters = $data->{$c};
    my $s = "";
    foreach (@all_periods) {
      if ($quarters->{$_}) {
        $s = $s . "$_,";
      } else {
        $s = $s . ';';
      }
    }
    $s =~ s/(\;)+/\;/g;
    $s =~ s/^\;//;
    $s =~ s/\;$//;
    my @periods = split (/\;/, $s);
    foreach (@periods) {
      my $p = $_;
      $p =~ s/,$//;
      my @ps = split (/,/, $p);
      my $json = "{ cik: \"" . sprintf('%010d', int($cik)) . "\", cusip6: \"" . substr(uc($c), 0, 6) . "\", cusip9: \"" . uc($c) . "\", ownership_length: " . (1+$#ps) . ", from: { year: " . substr ($ps[0], 0, 4) . ", quarter: " . substr ($ps[0], 5, 1) . " }, to: { year: " . substr ($ps[$#ps], 0, 4) . ", quarter: " . substr ($ps[$#ps], 5, 1) . " } }";
      push (@docs_text, $json);
      #print "PERIODS: Trying to insert $json\n";
      push (@documents, { cik => sprintf('%010d', int($cik)), cusip6 => substr(uc($c), 0, 6), cusip9 => uc($c), ownership_length => (1+$#ps), from => { year => int(substr ($ps[0], 0, 4)), quarter => int(substr ($ps[0], 5, 1))}, to => { year => int(substr ($ps[$#ps], 0, 4)), quarter => int(substr ($ps[$#ps], 5, 1)) } });
      #$coll_companies->insert_one ({ cusip => $c, name => $companies->{$c}->{'issuer'} });
    }
  } 
  
  print "PERIODS: Trying to insert in bulk:\n";

  foreach(@docs_text) {
    print "$_\n";
  }

  $coll_periods->insert_many([ @documents ], { ordered => 0 });
}

sub add_cik_mapping {
  my ($cik, $fund) = @_;

  my $json = "{ cik: \"" . sprintf('%010d', int($cik)) . "\", name: \"$fund\" }";
  print "FUNDS: Trying to insert $json\n";
  $coll_funds->insert_one ({ cik => sprintf('%010d', int($cik)), name => $fund });
}

#my $entries = $coll_periods->find;
#while (my $e = $entries->next) {
#    print Dumper $e;
#}

while (<>) {
  chomp;
  if (/13F-HR/ && !(/bank|corp/i) && /\s([0-9]+)\s/) {
    if (/^13F-HR\s+([A-Za-z0-9\s\,\-\.\/]+)\s([0-9]+)\s/) {
      my ($fund, $cik) = ($1, $2);
      $fund =~ s/\s+/ /g;
      $fund =~ s/\s$//;

      #print "CIK " . sprintf('%010d', int($cik)) . " ";
      #print "{$cik => \"$fund\"}\n";
      
      # add a cik to fund name mapping to the funds collection
      add_cik_mapping ($cik, $fund);

      # get all 13F and add to the periods collection after parsing each
      get_13f_list ($cik);
    }
  } 
}

while (<>) {  # form.idx file piped in
  chomp;
}

# disconnect the MongoDB client
$client->disconnect;

# we're done
print "Script finished.  Client disconnected.";
print "Exiting now ...";
exit 0;
