#!/usr/bin/perl -w

use Data::Dumper;
use MongoDB;

# create a client
my $client = MongoDB::MongoClient->new(
  host => $ENV{'MONGODB_PROTOCOL_SCRIPT'} . '://' . $ENV{'MONGODB_HOST_SCRIPT'},
  username => $ENV{'MONGODB_USER_SCRIPT'},
  password => $ENV{'MONGODB_PASS_SCRIPT'},
);

# connection string
# my $client = MongoDB->connect('mongodb://scriptuser:Atlas2019@cluster0-gga6t.mongodb.net/test?retryWrites=true');
my $db = $client->get_database('test');

my $colls = $db->list_collections();
# print Dumper $colls;
my $coll = $db->get_collection('periods');
 
# quarters mappings
my $quarters = {
  '0327'=>'q1','0328'=>'q1','0629'=>'q1','0330'=>'q1','0331'=>'q1', 
  '0627'=>'q2','0628'=>'q2','0629'=>'q2','0630'=>'q2',
  '0927'=>'q3','0928'=>'q3','0930'=>'q3','0930'=>'q3', 
  '1227'=>'q4','1228'=>'q4','1229'=>'q4','1230'=>'q4','1231'=>'q4'
};

# create an array of all quarters of format "YYYYqQ"
# YYYY in { 2001 .. 2018 }
# Q    in { 1, 2, 3, 4 }
my @all_periods = ();
for (my $y = 2001;  $y <= 2018;  $y++) {
  for (my $q = 1;  $q < 5;  $q++) {
    push (@all_periods, "$y" . "q$q");
  }
}

# parsing 13f form (subroutine)
# what is a 13f form?
# https://www.investopedia.com/terms/f/form-13f.asp
sub parse_13f {
  my ($fn, $data) = @_;
  open (my $fh, '<:encoding(UTF-8)', $fn)
    or die "Could not open file '$filename' $!";
  my ($period, $text) = ('', 0);
 
  while (<$fh>) {
    if (/CONFORMED PERIOD OF REPORT:\s+(\d+)/) {
      $period = $1;
      $period = substr ($period, 0, 4) . $quarters->{substr ($period, 4, 4)};
    } elsif (/<cusip>([^<]+)/) {
      my $cusip = $1;
#      print "   cusip $cusip\n";
      $data->{$cusip}->{$period} = 1;
    } elsif (/^<S>/) { 
      $text = 1;
    } elsif ($text && /.+COM\s+([^\s]{9})/) {
      my $cusip = $1;
#      print "   cusip from text $cusip\n";
      $data->{$cusip}->{$period} = 1;
    }
  }
#  print "Period $period\n";
  close ($fh);
}

sub get_13f_list {
  my $cik = shift;
  my $data = {};
  my $fn  = "data/$cik.idx";

  if (! -e $fn) {
    my $url = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' . $cik . '&type=13f&dateb=&owner=exclude&count=1000';
    my $cmd = "curl -o '$fn' '$url'";
    # print $cmd;
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
        `curl -o '$of' '$url'`;
      }
      parse_13f ($of, $data);
    }
  }
  close ($fh);

  my @cusips = sort keys %$data;
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
      my $json = "{ cik: \'$cik\', cusip: \'$c\', quarters: " . (1+$#ps) . ", from: \'" . $ps[0] . "\', to: \'" . $ps[$#ps] . "\'}";
      print "Trying to insert $json\n";
      $coll->insert_one ({ cik => $cik, cusip => $c, quarters => (1+$#ps), from => $ps[0], to => $ps[$#ps] });
    }
  } 
}


# get_13f_list ('0000902464');
my $entries = $coll->find;
while (my $e = $entries->next) {
    print Dumper $e;
}

# get_13f_list ('0000728100');
# get_13f_list ('0001540531');
# get_13f_list ('1214717'); # geode
while (<>) {
  chomp;
  if (/13F/ && !(/bank|corp/i) && /([0-9]{7})\s/) {
    print "CIK $1\n";
    get_13f_list ($1);
  } 
}
