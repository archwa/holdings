(this.webpackJsonpholdings=this.webpackJsonpholdings||[]).push([[0],{122:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(12),i=a.n(r),s=(a(98),a(11)),o=a(8),c=a(14),u=a(15),h=a(9),m=a(16),d=(a(99),a(27)),g=a(36),p=a(23),f=a(169),y=a(155),b=a(159),E=a(5),v=a(154),k=a(19),S=a.n(k);function C(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function w(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?C(a,!0).forEach((function(t){Object(p.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):C(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var O=Object(E.a)((function(e){return{root:{color:"white",backgroundColor:v.a[500],"&:hover":{backgroundColor:v.a[700]}}}}))(y.a),_={container:{position:"relative",margin:"10px",textAlign:"center",justifyContent:"center"},textField:{margin:"5px",width:"50%",minWidth:"300px",display:"inline-block"},buttonGroup:{position:"absolute",top:"50%",transform:"translateY(-50%)",display:"inline-block"},button:{height:"100%"}},j=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={redirect:{go:!1,location:"/"},value:""},a._handleCompanySearch=a._handleCompanySearch.bind(Object(h.a)(a)),a._handleSymbolSearch=a._handleSymbolSearch.bind(Object(h.a)(a)),a._handleChange=a._handleChange.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"_handleChange",value:function(e){this.setState({value:e.target.value})}},{key:"_handleCompanySearch",value:function(e){var t={company:this.state.value},a=S.a.stringify(t),n=w({},this.state.redirect);n.location="/search?"+a,n.go=!0,console.log(this.state.value),console.log(n),this.setState({redirect:n})}},{key:"_handleSymbolSearch",value:function(e){var t={symbol:this.state.value},a=S.a.stringify(t),n=w({},this.state.redirect);n.location="/search?"+a,n.go=!0,console.log(this.state.value),console.log(n),this.setState({redirect:n})}},{key:"render",value:function(){var e=this.state.redirect.go,t=this.state.redirect.location;return l.a.createElement("div",{style:_.container},l.a.createElement("form",{onSubmit:this._handleCompanySearch},e?l.a.createElement(g.a,{to:t}):null,l.a.createElement(f.a,{onChange:this._handleChange,label:"Search",variant:"outlined",style:_.textField,fullWidth:!0}),l.a.createElement(b.a,{style:_.buttonGroup},l.a.createElement(O,{variant:"contained",onClick:this._handleCompanySearch,style:_.button},"Company"),l.a.createElement(O,{variant:"contained",onClick:this._handleSymbolSearch,style:_.button},"Symbol"))))}}]),t}(l.a.Component),F=a(2),I=a.n(F),D=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).stitch=a.props.stitch,a._searchCompany=a._searchCompany.bind(Object(h.a)(a)),a._searchSymbol=a._searchSymbol.bind(Object(h.a)(a));var n=I.a.get(S.a.parse(I.a.get(a.props,"location.search",null)),"company",null),l=I.a.get(S.a.parse(I.a.get(a.props,"location.search",null)),"symbol",null);return a.state={companyQuery:n,symbolQuery:l,companyResults:null,symbolResults:null,loading:!0},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.stitchInitialized,t=this.state.companyQuery,a=this.state.symbolQuery;e&&t&&this._searchCompany(t),e&&a&&this._searchSymbol(a),e&&!t&&!a&&this.state.loading&&this.setState({loading:!1})}},{key:"componentDidUpdate",value:function(e){var t=this.props.stitchInitialized,a=I.a.get(S.a.parse(I.a.get(this.props,"location.search",null)),"company",null),n=I.a.get(S.a.parse(I.a.get(e,"location.search",null)),"company",null),l=I.a.get(S.a.parse(I.a.get(this.props,"location.search",null)),"symbol",null),r=I.a.get(S.a.parse(I.a.get(e,"location.search",null)),"symbol",null);a!==n&&this.setState({companyQuery:a,companyResults:null}),l!==r&&this.setState({symbolQuery:l,symbolResults:null}),t&&a&&a!==n&&this._searchCompany(a),t&&l&&l!==r&&this._searchSymbol(l)}},{key:"_searchCompany",value:function(e){var t=this;this.setState({loading:!0}),this.stitch.callFunction("searchForCompany",[e]).then((function(e){var a,n,l=I.a.get(e,"data.filerSearch.data",null),r=I.a.get(e,"data.issuerSearch.data",null);n=1!==r.count?I.a.map(r.results,(function(e){return{name:I.a.get(e,"names.0",null),cusip6:I.a.get(e,"cusip6",null)}})):[{name:I.a.get(r,"results.data.issuer_names.0",null),cusip6:I.a.get(r,"results.data.issuer_cusip6",null)}],a=1!==l.count?I.a.map(l.results,(function(e){return{name:I.a.get(e,"name",null),cik:I.a.get(e,"cik",null)}})):[{name:I.a.get(l,"results.data.filer_names.0",null),cik:I.a.get(l,"results.data.filer_cik",null)}];var i=I.a.reduce(n,(function(e,t){var a=e,n=I.a.get(t,"name",null);return a[n]?a[n].holders||(a[n].holders=I.a.get(t,"cusip6",null)):a[n]={holders:I.a.get(t,"cusip6",null)},a}),{}),s=I.a.reduce(a,(function(e,t){var a=e,n=I.a.get(t,"name",null);return a[n]?a[n].holdings||(a[n].holdings=I.a.get(t,"cik",null)):a[n]={holdings:I.a.get(t,"cik",null)},a}),{}),o=I.a.merge(i,s);console.log(e),t.setState({loading:!1,companyResults:o})})).catch((function(e){console.error(e),t.setState({loading:!1})}))}},{key:"_searchSymbol",value:function(e){var t=this;this.setState({loading:!0}),console.log(e),this.stitch.callFunction("searchForSymbol",[e]).then((function(e){if(console.log(e),e.status||e.data){var a=I.a.get(e,"data",null),n=I.a.get(a,"symbol.symbol",null),l=I.a.get(a,"holdersView",null),r=I.a.get(a,"holdingsView",null),i=r?{name:I.a.get(r,"data.filer_names.0",null),cik:I.a.get(r,"data.filer_cik",null)}:null,s=l?{name:I.a.get(l,"data.issuer_names.0",null),cusip6:I.a.get(l,"data.issuer_cusip6",null)}:null,o={name:i?i.name:s?s.name:n,symbol:n,holdings:i?I.a.get(i,"cik",null):null,holders:s?I.a.get(s,"cusip6",null):null};t.setState({loading:!1,symbolResults:o})}else t.setState({loading:!1,symbolResults:null})})).catch((function(e){console.error(e),t.setState({loading:!1})}))}},{key:"render",value:function(){var e=this.state.loading,t=this.state.companyResults,a=this.state.symbolResults,n=this.state.companyQuery,r=this.state.symbolQuery;return l.a.createElement("div",null,e||n||r?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"Please provide a search query."),!e&&(n||r)&&I.a.isEmpty(t)&&I.a.isEmpty(a)?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),function(){var e="No results";return n&&(e+=' for company query "'.concat(n,'"')),n&&r&&(e+=" or"),r&&(e+=' for symbol query "'.concat(r,'"')),e+="."}()):null,e&&(n||r)?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"One moment please ..."):null,I.a.isEmpty(t)||e?null:l.a.createElement("div",{style:{textAlign:"left",margin:"10px"}},l.a.createElement("h2",null,"Company Results"),l.a.createElement("ul",null,I.a.reduce(t,(function(e,t,a){var n=l.a.createElement("li",{key:a.toString()},l.a.createElement("strong",null,a.toString())," : ",t.holders?l.a.createElement(d.b,{to:"/holders/"+t.holders.toString()},"Holders"):null,t.holders&&t.holdings?" | ":null,t.holdings?l.a.createElement(d.b,{to:"/holdings/"+t.holdings.toString()},"Holdings"):null,t.holders||t.holdings?null:"No holders or holdings views available.");return I.a.concat(e,n)}),[]))),I.a.isEmpty(a)||e?null:l.a.createElement("div",{style:{textAlign:"left",margin:"10px"}},l.a.createElement("h2",null,"Symbol Results"),l.a.createElement("ul",null,function(){var e=I.a.get(a,"name",null),t=I.a.get(a,"symbol",null),n=I.a.get(a,"holders",null),r=I.a.get(a,"holdings",null);return console.log(a),l.a.createElement("li",{key:e},l.a.createElement("strong",null,e+" ( "+t+" )")," : ",n?l.a.createElement(d.b,{to:"/holders/"+n},"Holders"):null,n&&r?" | ":null,r?l.a.createElement(d.b,{to:"/holdings/"+r},"Holdings"):null,n||r?null:"No holders or holdings views available.")}())))}}]),t}(l.a.Component),P=a(158),x=a(161),q=a(46),H=a.n(q),A=a(48),M=a.n(A),W=a(47),R=a.n(W),z=a(45),T=a.n(z),N=a(160),B=a(29),L=a(165),Q=a(166),U=a(164),K=a(162),V=a(168),J=a(163),Y=a(170),G=a(171);function Z(e){var t=Object(N.a)((function(e){return{root:{flexShrink:0,marginLeft:e.spacing(2.5)}}}))(),a=Object(B.a)(),n=e.count,r=e.page,i=e.rowsPerPage,s=e.onChangePage;return l.a.createElement("div",{className:t.root},l.a.createElement(x.a,{onClick:function(e){s(e,0)},disabled:0===r,"aria-label":"first page"},"rtl"===a.direction?l.a.createElement(T.a,null):l.a.createElement(H.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,r-1)},disabled:0===r,"aria-label":"previous page"},"rtl"===a.direction?l.a.createElement(R.a,null):l.a.createElement(M.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,r+1)},disabled:r>=Math.ceil(n/i)-1,"aria-label":"next page"},"rtl"===a.direction?l.a.createElement(M.a,null):l.a.createElement(R.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,Math.max(0,Math.ceil(n/i)-1))},disabled:r>=Math.ceil(n/i)-1,"aria-label":"last page"},"rtl"===a.direction?l.a.createElement(H.a,null):l.a.createElement(T.a,null)))}function X(e,t,a){return t[a]<e[a]?-1:t[a]>e[a]?1:0}function $(e){e.classes;var t=e.order,a=e.orderBy,n=e.onRequestSort,r=e.headCells;return l.a.createElement(K.a,null,l.a.createElement(J.a,null,r.map((function(e){return l.a.createElement(U.a,{key:e.id,align:e.align,style:{minWidth:e.minWidth,fontFamily:"Courier New"},padding:e.disablePadding?"none":"default",sortDirection:a===e.id&&t},l.a.createElement(G.a,{active:a===e.id,direction:t,onClick:(r=e.id,function(e){n(e,r)})},e.label));var r}))))}var ee=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).stitch=a.props.stitch,a._getHoldings=a._getHoldings.bind(Object(h.a)(a)),a._handleChange=a._handleChange.bind(Object(h.a)(a));var n=I.a.get(a.props,"match.params.cik",null),l=I.a.get(S.a.parse(I.a.get(a.props,"location.search",null)),"cik",null),r=n||l;return a.state={holdings:null,cik:r,loading:!0,tableInfo:{page:0,rowsPerPage:10},currentOnly:!1,tableDense:!1,order:"asc",orderBy:"name"},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.state.cik;this.props.stitchInitialized&&e?this._getHoldings(e):this.props.stitchInitialized&&this.state.loading&&this.setState({loading:!1})}},{key:"componentDidUpdate",value:function(e){if(this.props.stitchInitialized){var t,a,n=I.a.get(this.props,"match.params.cik",null),l=I.a.get(e,"match.params.cik",null),r=I.a.get(S.a.parse(I.a.get(this.props,"location.search",null)),"cik",null),i=I.a.get(S.a.parse(I.a.get(e,"location.search",null)),"cik",null);if(n||r)n?(t=n,a=l):r&&(t=r,a=i),t!==a&&this._getHoldings(t)}}},{key:"_handleChange",value:function(e,t){"current_only"===t&&this.setState({currentOnly:e.target.checked}),"table_density"===t&&this.setState({tableDense:e.target.checked})}},{key:"_getHoldings",value:function(e){var t=this,a=e.toString();if(a.length<=10){var n=a.padStart(10,"0");this.stitch.callFunction("getHoldingsForFiler",[n]).then((function(e){var a,n=I.a.get(e,"data.holdings",null);n&&(a=I.a.map(n,(function(e,t){return{name:I.a.get(e,"issuer_names.0",null),cusip6:I.a.get(e,"cusip6",null),cusip9:I.a.get(e,"cusip9",null),from:I.a.get(e,"from.year")+"q"+I.a.get(e,"from.quarter"),to:I.a.get(e,"to.year")+"q"+I.a.get(e,"to.quarter"),ownership_length:I.a.get(e,"ownership_length"),key:I.a.get(e,"cusip6","")+t.toString()}}))),I.a.isEmpty(a)&&(a=null),t.setState({holdings:a,loading:!1,filer_names:I.a.get(e,"data.filer_names",null)})})).catch((function(e){t.setState({loading:!1}),console.error(e)}))}else this.setState({loading:!1,cik:a})}},{key:"render",value:function(){var e=this,t=this.state.order,a=this.state.orderBy,n=Object(N.a)({root:{width:"100%"},tableWrapper:{maxHeight:440,overflow:"auto"}}),r=function(t,a){var n=e.state.tableInfo;n.page=a,e.setState({tableInfo:n})},i=[{id:"name",label:"Issuer Name",minWidth:170},{id:"from",label:"From",minWidth:70,format:function(e){return e.toLocaleString()},align:"right"},{id:"to",label:"To",minWidth:70,align:"right"},{id:"ownership_length",label:"Ownership Length (Quarters)",minWidth:70,align:"right"}],s=this.state.tableInfo.rowsPerPage,o=this.state.tableInfo.page,c=this.state.loading,u=new Date,h=u.getFullYear(),m=1+~~((u.getMonth()+1)/3),g=this.state.currentOnly,p=I.a.filter(this.state.holdings,(function(e){return e.name&&e.cusip6&&e.cusip9}));g&&(p=I.a.filter(p,(function(e){var t=parseInt(I.a.get(e,"to","0000q0").substring(0,4)),a=parseInt(I.a.get(e,"to","0000q0").substring(5,6));return Math.abs(h-t)?1===Math.abs(h-t)&&1===m&&4===a:Math.abs(m-a)<=1})));var f=this.state.cik,y=0;p&&p.length&&(y=I.a.reduce(I.a.map(p,(function(e){return e.ownership_length})),(function(e,t){return e+t}),0)/p.length,y=Math.round(1e3*y)/1e3);var b=I.a.get(this.state,"filer_names.0",null),E=this.state.tableDense;return l.a.createElement(l.a.Fragment,null,c?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"One moment please ..."):null,c||p?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),'No results for requested CIK "'.concat(f,'"!')),c||!p?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{display:"block",width:"100%",textAlign:"center",fontFamily:"raleway"}},l.a.createElement("h1",null,b)),l.a.createElement("div",{style:{display:"flex",flexDirection:"column",textAlign:"right",margin:"10px"}},l.a.createElement("div",null,"Dense table padding",l.a.createElement(Y.a,{checked:E,onChange:function(t){return e._handleChange(t,"table_density")},color:"primary"})),l.a.createElement("div",null,"Show current holdings only ",l.a.createElement(Y.a,{checked:g,onChange:function(t){e._handleChange(t,"current_only"),r(0,0)},color:"primary"})),l.a.createElement("div",{style:{fontFamily:"Courier New"}},l.a.createElement("strong",null,"Average Ownership Length"),": ",y," quarters (",Math.round(1e3*y/4)/1e3," years)")),l.a.createElement(P.a,{className:n.root,style:{display:"block",width:"100%"}},l.a.createElement("div",{className:n.tableWrapper},l.a.createElement(L.a,{size:E?"small":"medium",stickyHeader:!0,"aria-label":"sticky table"},l.a.createElement($,{classes:n,order:t,orderBy:a,onRequestSort:function(n,l){var r=a===l&&"desc"===t;e.setState({order:r?"asc":"desc"}),e.setState({orderBy:l})},headCells:i}),l.a.createElement(Q.a,null,p?function(e,t){var a=e.map((function(e,t){return[e,t]}));return a.sort((function(e,a){var n=t(e[0],a[0]);return 0!==n?n:e[1]-a[1]})),a.map((function(e){return e[0]}))}(p,function(e,t){return"desc"===e?function(e,a){return X(e,a,t)}:function(e,a){return-X(e,a,t)}}(t,a)).slice(o*s,o*s+s).map((function(e){return l.a.createElement(J.a,{hover:!0,tabIndex:-1,key:e.key},i.map((function(t){var a=e[t.id];return l.a.createElement(U.a,{key:t.id,align:t.align,style:{fontFamily:"Courier New"}},"name"===t.id?l.a.createElement(d.b,{style:{textDecoration:"none",color:"blue"},to:"/holders/"+e.cusip6},a):t.format&&"number"===typeof a?t.format(a):a)})))})):null))),l.a.createElement(V.a,{rowsPerPageOptions:[10,25,50,100],component:"div",count:p?p.length:0,rowsPerPage:s,page:o,onChangePage:r,onChangeRowsPerPage:function(t){var a=e.state.tableInfo;a.page=0,a.rowsPerPage=+t.target.value,e.setState({tableInfo:a})},ActionsComponent:Z}))))}}]),t}(l.a.Component);function te(e){var t=Object(N.a)((function(e){return{root:{flexShrink:0,marginLeft:e.spacing(2.5)}}}))(),a=Object(B.a)(),n=e.count,r=e.page,i=e.rowsPerPage,s=e.onChangePage;return l.a.createElement("div",{className:t.root},l.a.createElement(x.a,{onClick:function(e){s(e,0)},disabled:0===r,"aria-label":"first page"},"rtl"===a.direction?l.a.createElement(T.a,null):l.a.createElement(H.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,r-1)},disabled:0===r,"aria-label":"previous page"},"rtl"===a.direction?l.a.createElement(R.a,null):l.a.createElement(M.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,r+1)},disabled:r>=Math.ceil(n/i)-1,"aria-label":"next page"},"rtl"===a.direction?l.a.createElement(M.a,null):l.a.createElement(R.a,null)),l.a.createElement(x.a,{onClick:function(e){s(e,Math.max(0,Math.ceil(n/i)-1))},disabled:r>=Math.ceil(n/i)-1,"aria-label":"last page"},"rtl"===a.direction?l.a.createElement(H.a,null):l.a.createElement(T.a,null)))}function ae(e,t,a){return t[a]<e[a]?-1:t[a]>e[a]?1:0}function ne(e){e.classes;var t=e.order,a=e.orderBy,n=e.onRequestSort,r=e.headCells;return l.a.createElement(K.a,null,l.a.createElement(J.a,null,r.map((function(e){return l.a.createElement(U.a,{key:e.id,align:e.align,style:{minWidth:e.minWidth,fontFamily:"Courier New"},padding:e.disablePadding?"none":"default",sortDirection:a===e.id&&t},l.a.createElement(G.a,{active:a===e.id,direction:t,onClick:(r=e.id,function(e){n(e,r)})},e.label));var r}))))}var le=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).stitch=a.props.stitch,a._getHolders=a._getHolders.bind(Object(h.a)(a)),a._handleChange=a._handleChange.bind(Object(h.a)(a));var n=I.a.get(a.props,"match.params.cusip",null),l=I.a.get(S.a.parse(I.a.get(a.props,"location.search",null)),"cusip",null),r=n||l;return a.state={holders:null,cusip:r,loading:!0,tableInfo:{page:0,rowsPerPage:10},currentOnly:!1,tableDense:!1,order:"asc",orderBy:"name"},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.state.cusip;this.props.stitchInitialized&&e?this._getHolders(e):this.props.stitchInitialized&&this.state.loading&&this.setState({loading:!1})}},{key:"componentDidUpdate",value:function(e){if(this.props.stitchInitialized){var t,a,n=I.a.get(this.props,"match.params.cusip",null),l=I.a.get(e,"match.params.cusip",null),r=I.a.get(S.a.parse(I.a.get(this.props,"location.search",null)),"cusip",null),i=I.a.get(S.a.parse(I.a.get(e,"location.search",null)),"cusip",null);if(n||r)n?(t=n,a=l):r&&(t=r,a=i),t!==a&&this._getHolders(t)}}},{key:"_handleChange",value:function(e,t){"current_only"===t&&this.setState({currentOnly:e.target.checked}),"table_density"===t&&this.setState({tableDense:e.target.checked})}},{key:"_getHolders",value:function(e){var t=this,a=e.toString();if(a.length>=6){var n=e.substr(0,6);this.stitch.callFunction("getHoldersForIssuer",[n]).then((function(e){var a,n=I.a.get(e,"data.holdings",null);n&&(a=I.a.map(n,(function(e,t){return{name:I.a.get(e,"filer_names.0",null),cik:I.a.get(e,"cik",null),cusip9:I.a.get(e,"cusip9",null),from:I.a.get(e,"from.year")+"q"+I.a.get(e,"from.quarter"),to:I.a.get(e,"to.year")+"q"+I.a.get(e,"to.quarter"),ownership_length:I.a.get(e,"ownership_length"),key:I.a.get(e,"cik","")+t.toString()}}))),I.a.isEmpty(a)&&(a=null),t.setState({holders:a,loading:!1,issuer_names:I.a.get(e,"data.issuer_names",null)})})).catch((function(e){t.setState({loading:!1}),console.error(e)}))}else this.setState({loading:!1,cusip:a})}},{key:"render",value:function(){var e=this,t=this.state.order,a=this.state.orderBy,n=Object(N.a)({root:{width:"100%"},tableWrapper:{maxHeight:440,overflow:"auto"}}),r=[{id:"name",label:"Holder Name",minWidth:170},{id:"from",label:"From",minWidth:70,format:function(e){return e.toLocaleString()},align:"right"},{id:"to",label:"To",minWidth:70,align:"right"},{id:"ownership_length",label:"Ownership Length (Quarters)",minWidth:170,align:"right"}],i=function(t,a){var n=e.state.tableInfo;n.page=a,e.setState({tableInfo:n})},s=this.state.tableInfo.rowsPerPage,o=this.state.tableInfo.page,c=this.state.loading,u=new Date,h=u.getFullYear(),m=1+~~((u.getMonth()+1)/3),g=this.state.currentOnly,p=I.a.filter(this.state.holders,(function(e){return e.name&&e.cik&&e.cusip9}));g&&(p=I.a.filter(p,(function(e){var t=parseInt(I.a.get(e,"to","0000q0").substring(0,4)),a=parseInt(I.a.get(e,"to","0000q0").substring(5,6));return Math.abs(h-t)?1===Math.abs(h-t)&&1===m&&4===a:Math.abs(m-a)<=1})));var f=this.state.cusip,y=0;p&&p.length&&(y=I.a.reduce(I.a.map(p,(function(e){return e.ownership_length})),(function(e,t){return e+t}),0)/p.length,y=Math.round(1e3*y)/1e3);var b=I.a.get(this.state,"issuer_names.0",null),E=this.state.tableDense;return l.a.createElement(l.a.Fragment,null,c?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"One moment please ..."):null,c||p?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),'No results for requested CUSIP "'.concat(f,'"!')),c||!p?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{display:"block",width:"100%",textAlign:"center",fontFamily:"raleway"}},l.a.createElement("h1",null,b)),l.a.createElement("div",{style:{display:"flex",flexDirection:"column",textAlign:"right",margin:"10px"}},l.a.createElement("div",null,"Dense table padding",l.a.createElement(Y.a,{checked:E,onChange:function(t){return e._handleChange(t,"table_density")},color:"primary"})),l.a.createElement("div",null,"Show current holders only ",l.a.createElement(Y.a,{checked:g,onChange:function(t){e._handleChange(t,"current_only"),i(0,0)},color:"primary"})),l.a.createElement("div",{style:{fontFamily:"Courier New"}},l.a.createElement("strong",null,"Average Ownership Length"),": ",y," quarters (",Math.round(1e3*y/4)/1e3," years)")),l.a.createElement(P.a,{className:n.root,style:{display:"block",width:"100%"}},l.a.createElement("div",{className:n.tableWrapper},l.a.createElement(L.a,{size:E?"small":"medium",stickyHeader:!0,"aria-label":"sticky table"},l.a.createElement(ne,{classes:n,order:t,orderBy:a,onRequestSort:function(n,l){var r=a===l&&"desc"===t;e.setState({order:r?"asc":"desc"}),e.setState({orderBy:l})},headCells:r}),l.a.createElement(Q.a,null,p?function(e,t){var a=e.map((function(e,t){return[e,t]}));return a.sort((function(e,a){var n=t(e[0],a[0]);return 0!==n?n:e[1]-a[1]})),a.map((function(e){return e[0]}))}(p,function(e,t){return"desc"===e?function(e,a){return ae(e,a,t)}:function(e,a){return-ae(e,a,t)}}(t,a)).slice(o*s,o*s+s).map((function(e){return l.a.createElement(J.a,{hover:!0,tabIndex:-1,key:e.key},r.map((function(t){var a=e[t.id];return l.a.createElement(U.a,{key:t.id,align:t.align,style:{fontFamily:"Courier New"}},"name"===t.id?l.a.createElement(d.b,{style:{textDecoration:"none",color:"blue"},to:"/holdings/"+e.cik},a):t.format&&"number"===typeof a?t.format(a):a)})))})):null))),l.a.createElement(V.a,{rowsPerPageOptions:[10,25,50,100],component:"div",count:p?p.length:0,rowsPerPage:s,page:o,onChangePage:i,onChangeRowsPerPage:function(t){var a=e.state.tableInfo;a.page=0,a.rowsPerPage=+t.target.value,e.setState({tableInfo:a})},ActionsComponent:te}))))}}]),t}(l.a.Component),re=a(40),ie=a.n(re),se=a(61),oe=a(156),ce=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={loading:!0,status:0,inputValue:""},a.stitch=new Ce,a._handleInputChange=a._handleInputChange.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"_handleInputChange",value:function(e){this.setState({inputValue:e.target.value})}},{key:"_handleClick",value:function(e){var t=this.state.inputValue;switch(e){case"company":this.stitch.callFunction("searchForCompany",[t]).then((function(e){return console.log(e),{companySearchResult:e}})).catch((function(e){console.log(e)}));break;case"symbol":this.stitch.callFunction("searchForSymbol",[t]).then((function(e){return console.log(e),{symbolSearchResult:e}})).catch((function(e){console.log(e)}))}}},{key:"componentDidMount",value:function(){var e=this;this.stitch.init().then((function(){e.setState({loading:!1,status:0})})).catch((function(t){console.log(t),e.setState({loading:!1,status:-1})}))}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{style:ue.container},l.a.createElement(oe.a,{disabled:this.state.loading,error:this.state.error,placeholder:"Search by ...",style:ue.input,value:this.state.inputValue,onChange:this._handleInputChange}),l.a.createElement(b.a,null,l.a.createElement(y.a,{disabled:this.state.loading,onClick:function(){return e._handleClick("company")}},"Company"),l.a.createElement(y.a,{disabled:this.state.loading,onClick:function(){return e._handleClick("symbol")}},"Symbol")))}}]),t}(l.a.Component),ue={container:{},button:{},input:{margin:5}},he=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e)))._handleSort=function(e){return function(){var t=a.state,n=t.column,l=t.direction;n!==e?a.setState({column:e,direction:"ascending",data:I.a.sortBy(a.state.data,[e])}):a.setState({direction:"ascending"===l?"descending":"ascending",data:a.state.data.reverse()})}},a.state={column:null,direction:null,data:a.props.results.data,rawData:a.props.results.data},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){I.a.isEqual(this.props.results.data,this.state.rawData)||this.setState({data:this.props.results.data,rawData:this.props.results.data})}},{key:"render",value:function(){var e=this,t=this.state,a=t.column,n=t.direction,r=t.data,i={name:"Name",cik:"CIK",from:"From",to:"To",quarters:"Quarters"};return l.a.createElement("div",{style:me.container},l.a.createElement(L.a,null,l.a.createElement(K.a,null,l.a.createElement(J.a,null,I.a.map(["name","cik","from","to","quarters"],(function(t){return l.a.createElement(U.a,{key:t,sorted:a===t?n:null,onClick:e._handleSort(t)},i[t])})))),l.a.createElement(Q.a,null,I.a.map(r,(function(e,t){var a=e.name,n=e.cik,r=e.from,i=e.to,s=e.quarters;return l.a.createElement(J.a,{key:I.a.join([n,"-",t],"")},l.a.createElement(U.a,null,l.a.createElement("code",null,a)),l.a.createElement(U.a,null,l.a.createElement("code",null,n)),l.a.createElement(U.a,null,l.a.createElement("code",null,r)),l.a.createElement(U.a,null,l.a.createElement("code",null,i)),l.a.createElement(U.a,null,l.a.createElement("code",null,s)))})))))}}]),t}(l.a.Component),me={container:{margin:20}},de=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e)))._handleSort=function(e){return function(){var t=a.state,n=t.column,l=t.direction;n!==e?a.setState({column:e,direction:"ascending",data:I.a.sortBy(a.state.data,[e])}):a.setState({direction:"ascending"===l?"descending":"ascending",data:a.state.data.reverse()})}},a.state={column:null,direction:null,data:a.props.results.data.filerSearch.data.results.data.holdings,rawResults:a.props.results.data.filerSearch.data.results.data.holdings},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){I.a.isEqual(this.props.results,this.state.rawResults)||this.setState({data:this.props.results.data,rawResults:this.props.results})}},{key:"render",value:function(){var e=this,t=this.state,a=t.column,n=t.direction,r=t.data,i={name:"Name",cusip:"CUSIP",from:"From",to:"To",quarters:"Quarters"};return l.a.createElement("div",{style:ge.container},l.a.createElement(L.a,null,l.a.createElement(K.a,null,l.a.createElement(J.a,null,I.a.map(["name","cusip","from","to","quarters"],(function(t){return l.a.createElement(U.a,{key:t,sorted:a===t?n:null,onClick:e._handleSort(t)},i[t])})))),l.a.createElement(Q.a,null,I.a.map(r,(function(e,t){var a=e.names,n=e.cusip6,r=e.from,i=e.to,s=e.ownership_length;return l.a.createElement(J.a,{key:I.a.join([n,"-",t],"")},l.a.createElement(U.a,null,l.a.createElement("code",null,a[0])),l.a.createElement(U.a,null,l.a.createElement("code",null,n)),l.a.createElement(U.a,null,l.a.createElement("code",null,r.year,"q",r.quarter)),l.a.createElement(U.a,null,l.a.createElement("code",null,i.year,"q",i.quarter)),l.a.createElement(U.a,null,l.a.createElement("code",null,s)))})))))}}]),t}(l.a.Component),ge={container:{margin:20}},pe=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={data:a.props.results.data,rawData:a.props.results.data},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){I.a.isEqual(this.props.results.data,this.state.rawData)||this.setState({data:this.props.results.data,rawData:this.props.results.data})}},{key:"render",value:function(){var e=this.state.data;return l.a.createElement("div",{style:fe.container},l.a.createElement(L.a,null,l.a.createElement(Q.a,null,l.a.createElement(J.a,{key:"total"},l.a.createElement(U.a,null,l.a.createElement("strong",null,"Total Positions Found")),l.a.createElement(U.a,null,l.a.createElement("code",null,e.positionsCount))),l.a.createElement(J.a,{key:"year"},l.a.createElement(U.a,null,l.a.createElement("strong",null,"Average Time Held of All Positions (Years)")),l.a.createElement(U.a,null,l.a.createElement("code",null,Math.round(1e3*e.averageLengthOfStockOwnership.years)/1e3))),l.a.createElement(J.a,{key:"quarters"},l.a.createElement(U.a,null,l.a.createElement("strong",null,"Average Time Held of All Positions (Quarters)")),l.a.createElement(U.a,null,l.a.createElement("code",null,Math.round(1e3*e.averageLengthOfStockOwnership.quarters)/1e3))))))}}]),t}(l.a.Component),fe={container:{margin:20}},ye=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={results:a.props.results},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){I.a.isEqual(this.props.results,this.state.results)||this.setState({results:this.props.results})}},{key:"render",value:function(){var e=this.state.results;return l.a.createElement("div",{style:be.container},I.a.get(e,"companySearchResult",-1)?null:l.a.createElement(l.a.Fragment,null,"Showing results for fund ",l.a.createElement("strong",null,l.a.createElement("code",null,'"',I.a.get(e,"companySearchResult.data.filerSearch.data.count",""),'" (CIK : ',I.a.get(e,"companySearchResult.data.filerSearch.data.count",""),")"))),I.a.get(e,"searchForCompany.status",-1)?null:l.a.createElement(l.a.Fragment,null,"Showing results for company ",l.a.createElement("strong",null,l.a.createElement("code",null,'"',I.a.get(e,"searchForCompany.data.name",""),'" (CUSIP : ',I.a.get(e,"searchForCompany.data.cusip",""),")"))),I.a.get(e,"getAverageTimePositionsHeldForFund.status",-1)?null:l.a.createElement(pe,{results:e.getAverageTimePositionsHeldForFund}),I.a.get(e,"companySearchResult.status",-1)?null:l.a.createElement(de,{results:e.companySearchResult}),I.a.get(e,"symbolSearchResult.status",-1)?null:l.a.createElement(he,{results:e.symbolSearchResult}))}}]),t}(l.a.Component),be={container:{margin:20}},Ee=(l.a.Component,a(121)),ve=Ee.Stitch,ke=Ee.RemoteMongoClient,Se=Ee.UserApiKeyCredential,Ce=function(){function e(){Object(s.a)(this,e),this.db={},this.sc={}}return Object(o.a)(e,[{key:"init",value:function(){var e=Object(se.a)(ie.a.mark((function e(){var t;return ie.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.initClientForAppId("filings-uypee"),e.next=4,this.loginUsingApiKey("pv8Ad54AZcKhdyV13AjL0522JOMTGR3H95FKraLkD7iQWJKTdBOoVuE3x8JhIvB8");case 4:return e.next=6,this.initServiceClient("mongodb-atlas");case 6:return t=e.sent,e.next=9,this.initDBFromServiceClient("filings",t);case 9:return e.abrupt("return",0);case 12:return e.prev=12,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",e.t0);case 16:case"end":return e.stop()}}),e,this,[[0,12]])})));return function(){return e.apply(this,arguments)}}()},{key:"initClientForAppId",value:function(e){this.client=ve.initializeDefaultAppClient(e)}},{key:"loginUsingApiKey",value:function(e){var t=new Se("pv8Ad54AZcKhdyV13AjL0522JOMTGR3H95FKraLkD7iQWJKTdBOoVuE3x8JhIvB8");return this.client.auth.loginWithCredential(t).then((function(e){return console.log("Logged into Stitch client as API user (server) with id: ".concat(e.id)),e})).catch((function(e){return console.error(e),e}))}},{key:"initServiceClient",value:function(){var e=Object(se.a)(ie.a.mark((function e(t){return ie.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.client.getServiceClient(ke.factory,t);case 2:return this.sc[t]=e.sent,e.abrupt("return",this.sc[t]);case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"initDBFromServiceClient",value:function(){var e=Object(se.a)(ie.a.mark((function e(t,a){return ie.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.db(t);case 2:return this.db[t]=e.sent,e.abrupt("return",this.db[t]);case 4:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"callFunction",value:function(e,t){return this.client.callFunction(e,t).catch((function(e){return console.error(e),e}))}}]),e}(),we=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={window:{width:0,height:0},stitchInitialized:!1,loading:!0},a.stitch=new Ce,a._updateWindowDimensions=a._updateWindowDimensions.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"_updateWindowDimensions",value:function(){this.setState({window:{width:window.innerWidth,height:window.innerHeight}})}},{key:"componentDidMount",value:function(){var e=this;this._updateWindowDimensions(),window.addEventListener("resize",this._updateWindowDimensions),console.log("Initializing Stitch ..."),this.stitch.init().then((function(t){t?(console.error("Stitch initialization error:",t),e.setState({stitchInitialized:!1,loading:!1})):(console.log("Stitch initialization complete!"),e.setState({stitchInitialized:!0,loading:!1}))})).catch((function(t){console.error("Stitch initialization error:",t),e.setState({stitchInitialized:!1,loading:!1})}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this._updateWindowDimensions)}},{key:"render",value:function(){var e=this;return l.a.createElement(d.a,null,l.a.createElement("div",{className:"App"},l.a.createElement("div",{className:"App-body"},this.state.stitchInitialized||this.state.loading?null:l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"Error connecting to MongoDB Stitch!"),!this.state.stitchInitialized&&this.state.loading?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{minHeight:"30vh"}}),"Connecting to MongoDB Stitch server ..."):l.a.createElement(l.a.Fragment,null,l.a.createElement(g.d,null,l.a.createElement(g.b,{path:"/",exact:!0,render:function(e){return l.a.createElement("div",{className:"Welcome"},l.a.createElement("h2",null,"Welcome to the Holdings Analysis tool!"),"The purpose of this tool is to enable research of both current & historical holders of issued financial securities (holdings).",l.a.createElement("br",null),"This tool uses publicly available data disseminated by the U.S. Securities and Exchange Commission (SEC), the NASDAQ stock exchange, and others.",l.a.createElement("br",null),"To start using the tool, enter a search query using the search bar below.",l.a.createElement("br",null),l.a.createElement("span",null,"You may search either by company (e.g. ",l.a.createElement("strong",null,"Tesla")," for Tesla Inc.) or by stock symbol (e.g. ",l.a.createElement("strong",null,"MSFT")," for Microsoft Corp.)  (... or ",l.a.createElement("em",null,"both")," via search query string in the address bar.)"),l.a.createElement("h3",null,"Definitions"),l.a.createElement("ul",null,l.a.createElement("li",null,l.a.createElement("strong",null,"Holders")," are people, companies, and other entities that own, or ",l.a.createElement("em",null,"hold"),", a financial security."),l.a.createElement("li",null,l.a.createElement("strong",null,"Holdings")," are collections of financial securities issued to a given holder."),l.a.createElement("li",null,l.a.createElement("strong",null,"Issuers")," are companies that issue, or ascribe ownership of, financial securities to holders."),l.a.createElement("li",null,l.a.createElement("strong",null,"Filers")," are people, companies, and other entities that have filed any form with the SEC.")),l.a.createElement("h3",null,"Search Tips"),l.a.createElement("ul",null,l.a.createElement("li",null,"By default, search tokens match by a logical ",l.a.createElement("em",null,"or")," operation.  ",l.a.createElement("strong",null,"Example:")," The search query ",l.a.createElement("strong",null,"apple computer")," yields results matching ",l.a.createElement("strong",null,"apple"),", ",l.a.createElement("strong",null,"computer"),", or ",l.a.createElement("em",null,"both"),"."),l.a.createElement("li",null,"To search by exact phrase, use double quotes (",'"',").  ",l.a.createElement("strong",null,"Example:")," The search query ",l.a.createElement("strong",null,'"apple computer"')," yields results matching ",l.a.createElement("strong",null,"apple computer")," EXACTLY."),l.a.createElement("li",null,"To exclude a term, prepend that term with a hyphen (","-",").  ",l.a.createElement("strong",null,"Example:")," The search query ",l.a.createElement("strong",null,"apple -computer")," yields results matching ",l.a.createElement("strong",null,"apple")," but NOT ",l.a.createElement("strong",null,"computer"),".")))}})),l.a.createElement(j,null),l.a.createElement(g.d,null,l.a.createElement(g.b,{path:"/search/:search?",render:function(t){return l.a.createElement(D,Object.assign({},t,{stitch:e.stitch,stitchInitialized:e.state.stitchInitialized}))}}),l.a.createElement(g.b,{path:"/holdings/:cik?",render:function(t){return l.a.createElement(ee,Object.assign({},t,{stitch:e.stitch,stitchInitialized:e.state.stitchInitialized}))}}),l.a.createElement(g.b,{path:"/holders/:cusip?",render:function(t){return l.a.createElement(le,Object.assign({},t,{stitch:e.stitch,stitchInitialized:e.state.stitchInitialized}))}}))))))}}]),t}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(we,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},93:function(e,t,a){e.exports=a(122)},98:function(e,t,a){},99:function(e,t,a){}},[[93,1,2]]]);
//# sourceMappingURL=main.77622a4b.chunk.js.map