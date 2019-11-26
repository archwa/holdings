(this.webpackJsonpholdings=this.webpackJsonpholdings||[]).push([[0],{100:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(11),i=a.n(l),s=(a(77),a(12)),o=a(8),c=a(14),u=a(15),h=a(17),d=a(16),m=(a(78),a(61)),g=a(31),p=a(32),f=a.n(p),v=a(3),y=a.n(v),E=a(133),b=a(131),k=a(135),w=a(139),S=a(138),O=a(136),j=a(143),C=a(137),F=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).stitch=a.props.stitch,a._getHoldings=a._getHoldings.bind(Object(h.a)(a));var n=y.a.get(a.props,"match.params.cik",null),r=y.a.get(f.a.parse(y.a.get(a.props,"location.search",null)),"cik",null),l=n||r;return a.state={holdings:null,cik:l,loading:!0,tableInfo:{page:0,rowsPerPage:10}},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.state.cik;this.props.stitchInitialized&&e&&this._getHoldings(e)}},{key:"componentDidUpdate",value:function(e){if(this.props.stitchInitialized){var t,a,n=y.a.get(this.props,"match.params.cik",null),r=y.a.get(e,"match.params.cik",null),l=y.a.get(f.a.parse(y.a.get(this.props,"location.search",null)),"cik",null),i=y.a.get(f.a.parse(y.a.get(e,"location.search",null)),"cik",null);if(n||l)n?(t=n,a=r):l&&(t=l,a=i),t!==a&&this._getHoldings(t)}}},{key:"_getHoldings",value:function(e){var t=this;if(e.toString().length<=10){var a=a.padStart(10,"0");this.stitch.callFunction("getHoldingsForFiler",[a]).then((function(e){var a,n=y.a.get(e,"data.holdings",null);n&&(a=y.a.map(n,(function(e,t){return{name:y.a.get(e,"issuer_names",["null"])[0],cusip6:y.a.get(e,"cusip6",null),cusip9:y.a.get(e,"cusip9",null),from:y.a.get(e,"from.year")+"q"+y.a.get(e,"from.quarter"),to:y.a.get(e,"to.year")+"q"+y.a.get(e,"to.quarter"),ownership_length:y.a.get(e,"ownership_length"),key:y.a.get(e,"cusip6","")+t.toString()}}))),console.log(e),t.setState({holdings:a,loading:!1,issuer_names:y.a.get(e,"data.issuer_names",null)})})).catch((function(e){t.setState({loading:!1}),console.error(e)}))}else this.setState({loading:!1})}},{key:"render",value:function(){var e,t=this,a=Object(b.a)({root:{width:"100%"},tableWrapper:{maxHeight:440,overflow:"auto"}}),n=[{id:"name",label:"Issuer Name",minWidth:170},{id:"from",label:"From",minWidth:170,format:function(e){return e.toLocaleString()},align:"right"},{id:"to",label:"To",minWidth:170,align:"right"},{id:"ownership_length",label:"Ownership Length (Quarters)",minWidth:170,align:"right"}],l=this.state.tableInfo.rowsPerPage,i=this.state.tableInfo.page,s=this.state.loading,o=this.state.holdings,c=this.state.cik;o&&o.length&&(e=y.a.reduce(y.a.map(o,(function(e){return e.ownership_length})),(function(e,t){return e+t}),0)/o.length,e=Math.round(1e3*e)/1e3);var u=y.a.get(this.state,"issuer_names.0",null);return r.a.createElement(r.a.Fragment,null,s?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{minHeight:"30vh"}}),"Processing request ..."):null,s||o&&o.length?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{minHeight:"30vh"}}),'No results for requested CIK "'.concat(c,'"!')),o&&o.length?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{display:"block",width:"100%",textAlign:"center",fontFamily:"raleway"}},r.a.createElement("h1",null,u)),r.a.createElement("div",{style:{display:"block",fontFamily:"Courier New",textAlign:"left",margin:"10px"}},r.a.createElement("strong",null,"Average ownership"),": ",e," quarters (",e/4," years)"),r.a.createElement(E.a,{className:a.root,style:{display:"block",width:"100%"}},r.a.createElement("div",{className:a.tableWrapper},r.a.createElement(k.a,{stickyHeader:!0,"aria-label":"sticky table"},r.a.createElement(O.a,null,r.a.createElement(C.a,null,n.map((function(e){return r.a.createElement(S.a,{key:e.id,align:e.align,style:{minWidth:e.minWidth,fontFamily:"Courier New"}},r.a.createElement("strong",null,e.label))})))),r.a.createElement(w.a,null,this.state.holdings?this.state.holdings.slice(i*l,i*l+l).map((function(e){return r.a.createElement(C.a,{hover:!0,role:"checkbox",tabIndex:-1,key:e.key},n.map((function(t){var a=e[t.id];return r.a.createElement(S.a,{key:t.id,align:t.align,style:{fontFamily:"Courier New"}},t.format&&"number"===typeof a?t.format(a):a)})))})):null))),r.a.createElement(j.a,{rowsPerPageOptions:[10,25,50,100],component:"div",count:this.state.holdings?this.state.holdings.length:0,rowsPerPage:l,page:i,onChangePage:function(e,a){var n=t.state.tableInfo;n.page=a,t.setState({tableInfo:n})},onChangeRowsPerPage:function(e){var a=t.state.tableInfo;a.page=0,a.rowsPerPage=+e.target.value,t.setState({tableInfo:a})}}))):null)}}]),t}(r.a.Component),I=function(e){function t(e){var a;Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).stitch=a.props.stitch,a._getHolders=a._getHolders.bind(Object(h.a)(a));var n=y.a.get(a.props,"match.params.cusip",null),r=y.a.get(f.a.parse(y.a.get(a.props,"location.search",null)),"cusip",null),l=n||r;return a.state={holders:null,cusip:l,loading:!0,tableInfo:{page:0,rowsPerPage:10}},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.state.cusip;this.props.stitchInitialized&&e&&this._getHolders(e)}},{key:"componentDidUpdate",value:function(e){if(this.props.stitchInitialized){var t,a,n=y.a.get(this.props,"match.params.cusip",null),r=y.a.get(e,"match.params.cusip",null),l=y.a.get(f.a.parse(y.a.get(this.props,"location.search",null)),"cusip",null),i=y.a.get(f.a.parse(y.a.get(e,"location.search",null)),"cusip",null);if(n||l)n?(t=n,a=r):l&&(t=l,a=i),t!==a&&this._getHolders(t)}}},{key:"_getHolders",value:function(e){var t=this;if(e.toString().length>=6){var a=e.substr(0,6);this.stitch.callFunction("getHoldersForIssuer",[a]).then((function(e){var a,n=y.a.get(e,"data.holdings",null);n&&(a=y.a.map(n,(function(e,t){return{name:y.a.get(e,"filer_names",["null"])[0],cik:y.a.get(e,"cik",null),cusip9:y.a.get(e,"cusip9",null),from:y.a.get(e,"from.year")+"q"+y.a.get(e,"from.quarter"),to:y.a.get(e,"to.year")+"q"+y.a.get(e,"to.quarter"),ownership_length:y.a.get(e,"ownership_length"),key:y.a.get(e,"cik","")+t.toString()}}))),console.log(e),t.setState({holders:a,loading:!1,issuer_names:y.a.get(e,"data.issuer_names",null)})})).catch((function(e){t.setState({loading:!1}),console.error(e)}))}else this.setState({loading:!1})}},{key:"render",value:function(){var e,t=this,a=Object(b.a)({root:{width:"100%"},tableWrapper:{maxHeight:440,overflow:"auto"}}),n=[{id:"name",label:"Holder Name",minWidth:170},{id:"from",label:"From",minWidth:170,format:function(e){return e.toLocaleString()},align:"right"},{id:"to",label:"To",minWidth:170,align:"right"},{id:"ownership_length",label:"Ownership Length (Quarters)",minWidth:170,align:"right"}],l=this.state.tableInfo.rowsPerPage,i=this.state.tableInfo.page,s=this.state.loading,o=this.state.holders,c=this.state.cusip;o&&o.length&&(e=y.a.reduce(y.a.map(o,(function(e){return e.ownership_length})),(function(e,t){return e+t}),0)/o.length,e=Math.round(1e3*e)/1e3);var u=y.a.get(this.state,"issuer_names.0",null);return r.a.createElement(r.a.Fragment,null,s?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{minHeight:"30vh"}}),"Processing request ..."):null,s||o&&o.length?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{minHeight:"30vh"}}),'No results for requested CUSIP "'.concat(c,'"!')),o&&o.length?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{display:"block",width:"100%",textAlign:"center",fontFamily:"raleway"}},r.a.createElement("h1",null,u)),r.a.createElement("div",{style:{display:"block",fontFamily:"Courier New",textAlign:"left",margin:"10px"}},r.a.createElement("strong",null,"Average ownership"),": ",e," quarters (",e/4," years)"),r.a.createElement(E.a,{className:a.root,style:{display:"block",width:"100%"}},r.a.createElement("div",{className:a.tableWrapper},r.a.createElement(k.a,{stickyHeader:!0,"aria-label":"sticky table"},r.a.createElement(O.a,null,r.a.createElement(C.a,null,n.map((function(e){return r.a.createElement(S.a,{key:e.id,align:e.align,style:{minWidth:e.minWidth,fontFamily:"Courier New"}},r.a.createElement("strong",null,e.label))})))),r.a.createElement(w.a,null,this.state.holders?this.state.holders.slice(i*l,i*l+l).map((function(e){return r.a.createElement(C.a,{hover:!0,role:"checkbox",tabIndex:-1,key:e.key},n.map((function(t){var a=e[t.id];return r.a.createElement(S.a,{key:t.id,align:t.align,style:{fontFamily:"Courier New"}},t.format&&"number"===typeof a?t.format(a):a)})))})):null))),r.a.createElement(j.a,{rowsPerPageOptions:[10,25,50,100],component:"div",count:this.state.holders?this.state.holders.length:0,rowsPerPage:l,page:i,onChangePage:function(e,a){var n=t.state.tableInfo;n.page=a,t.setState({tableInfo:n})},onChangeRowsPerPage:function(e){var a=t.state.tableInfo;a.page=0,a.rowsPerPage=+e.target.value,t.setState({tableInfo:a})}}))):null)}}]),t}(r.a.Component),_=a(34),P=a.n(_),q=a(49),D=a(140),H=a(141),W=a(142),A=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={loading:!0,status:0,inputValue:""},a.stitch=new G,a._handleInputChange=a._handleInputChange.bind(Object(h.a)(a)),a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"_handleInputChange",value:function(e){this.setState({inputValue:e.target.value})}},{key:"_handleClick",value:function(e){var t=this.state.inputValue;switch(e){case"company":this.stitch.callFunction("searchForCompany",[t]).then((function(e){return console.log(e),{companySearchResult:e}})).catch((function(e){console.log(e)}));break;case"symbol":this.stitch.callFunction("searchForSymbol",[t]).then((function(e){return console.log(e),{symbolSearchResult:e}})).catch((function(e){console.log(e)}))}}},{key:"componentDidMount",value:function(){var e=this;this.stitch.init().then((function(){e.setState({loading:!1,status:0})})).catch((function(t){console.log(t),e.setState({loading:!1,status:-1})}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:x.container},r.a.createElement(D.a,{disabled:this.state.loading,error:this.state.error,placeholder:"Search by ...",style:x.input,value:this.state.inputValue,onChange:this._handleInputChange}),r.a.createElement(H.a,null,r.a.createElement(W.a,{disabled:this.state.loading,onClick:function(){return e._handleClick("company")}},"Company"),r.a.createElement(W.a,{disabled:this.state.loading,onClick:function(){return e._handleClick("symbol")}},"Symbol")))}}]),t}(r.a.Component),x={container:{},button:{},input:{margin:5}},z=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e)))._handleSort=function(e){return function(){var t=a.state,n=t.column,r=t.direction;n!==e?a.setState({column:e,direction:"ascending",data:y.a.sortBy(a.state.data,[e])}):a.setState({direction:"ascending"===r?"descending":"ascending",data:a.state.data.reverse()})}},a.state={column:null,direction:null,data:a.props.results.data,rawData:a.props.results.data},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){y.a.isEqual(this.props.results.data,this.state.rawData)||this.setState({data:this.props.results.data,rawData:this.props.results.data})}},{key:"render",value:function(){var e=this,t=this.state,a=t.column,n=t.direction,l=t.data,i={name:"Name",cik:"CIK",from:"From",to:"To",quarters:"Quarters"};return r.a.createElement("div",{style:N.container},r.a.createElement(k.a,null,r.a.createElement(O.a,null,r.a.createElement(C.a,null,y.a.map(["name","cik","from","to","quarters"],(function(t){return r.a.createElement(S.a,{key:t,sorted:a===t?n:null,onClick:e._handleSort(t)},i[t])})))),r.a.createElement(w.a,null,y.a.map(l,(function(e,t){var a=e.name,n=e.cik,l=e.from,i=e.to,s=e.quarters;return r.a.createElement(C.a,{key:y.a.join([n,"-",t],"")},r.a.createElement(S.a,null,r.a.createElement("code",null,a)),r.a.createElement(S.a,null,r.a.createElement("code",null,n)),r.a.createElement(S.a,null,r.a.createElement("code",null,l)),r.a.createElement(S.a,null,r.a.createElement("code",null,i)),r.a.createElement(S.a,null,r.a.createElement("code",null,s)))})))))}}]),t}(r.a.Component),N={container:{margin:20}},R=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e)))._handleSort=function(e){return function(){var t=a.state,n=t.column,r=t.direction;n!==e?a.setState({column:e,direction:"ascending",data:y.a.sortBy(a.state.data,[e])}):a.setState({direction:"ascending"===r?"descending":"ascending",data:a.state.data.reverse()})}},a.state={column:null,direction:null,data:a.props.results.data.filerSearch.data.results.data.holdings,rawResults:a.props.results.data.filerSearch.data.results.data.holdings},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){y.a.isEqual(this.props.results,this.state.rawResults)||this.setState({data:this.props.results.data,rawResults:this.props.results})}},{key:"render",value:function(){var e=this,t=this.state,a=t.column,n=t.direction,l=t.data,i={name:"Name",cusip:"CUSIP",from:"From",to:"To",quarters:"Quarters"};return r.a.createElement("div",{style:L.container},r.a.createElement(k.a,null,r.a.createElement(O.a,null,r.a.createElement(C.a,null,y.a.map(["name","cusip","from","to","quarters"],(function(t){return r.a.createElement(S.a,{key:t,sorted:a===t?n:null,onClick:e._handleSort(t)},i[t])})))),r.a.createElement(w.a,null,y.a.map(l,(function(e,t){var a=e.names,n=e.cusip6,l=e.from,i=e.to,s=e.ownership_length;return r.a.createElement(C.a,{key:y.a.join([n,"-",t],"")},r.a.createElement(S.a,null,r.a.createElement("code",null,a[0])),r.a.createElement(S.a,null,r.a.createElement("code",null,n)),r.a.createElement(S.a,null,r.a.createElement("code",null,l.year,"q",l.quarter)),r.a.createElement(S.a,null,r.a.createElement("code",null,i.year,"q",i.quarter)),r.a.createElement(S.a,null,r.a.createElement("code",null,s)))})))))}}]),t}(r.a.Component),L={container:{margin:20}},M=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={data:a.props.results.data,rawData:a.props.results.data},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){y.a.isEqual(this.props.results.data,this.state.rawData)||this.setState({data:this.props.results.data,rawData:this.props.results.data})}},{key:"render",value:function(){var e=this.state.data;return r.a.createElement("div",{style:T.container},r.a.createElement(k.a,null,r.a.createElement(w.a,null,r.a.createElement(C.a,{key:"total"},r.a.createElement(S.a,null,r.a.createElement("strong",null,"Total Positions Found")),r.a.createElement(S.a,null,r.a.createElement("code",null,e.positionsCount))),r.a.createElement(C.a,{key:"year"},r.a.createElement(S.a,null,r.a.createElement("strong",null,"Average Time Held of All Positions (Years)")),r.a.createElement(S.a,null,r.a.createElement("code",null,Math.round(1e3*e.averageLengthOfStockOwnership.years)/1e3))),r.a.createElement(C.a,{key:"quarters"},r.a.createElement(S.a,null,r.a.createElement("strong",null,"Average Time Held of All Positions (Quarters)")),r.a.createElement(S.a,null,r.a.createElement("code",null,Math.round(1e3*e.averageLengthOfStockOwnership.quarters)/1e3))))))}}]),t}(r.a.Component),T={container:{margin:20}},U=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={results:a.props.results},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(){y.a.isEqual(this.props.results,this.state.results)||this.setState({results:this.props.results})}},{key:"render",value:function(){var e=this.state.results;return r.a.createElement("div",{style:B.container},y.a.get(e,"companySearchResult",-1)?null:r.a.createElement(r.a.Fragment,null,"Showing results for fund ",r.a.createElement("strong",null,r.a.createElement("code",null,'"',y.a.get(e,"companySearchResult.data.filerSearch.data.count",""),'" (CIK : ',y.a.get(e,"companySearchResult.data.filerSearch.data.count",""),")"))),y.a.get(e,"searchForCompany.status",-1)?null:r.a.createElement(r.a.Fragment,null,"Showing results for company ",r.a.createElement("strong",null,r.a.createElement("code",null,'"',y.a.get(e,"searchForCompany.data.name",""),'" (CUSIP : ',y.a.get(e,"searchForCompany.data.cusip",""),")"))),y.a.get(e,"getAverageTimePositionsHeldForFund.status",-1)?null:r.a.createElement(M,{results:e.getAverageTimePositionsHeldForFund}),y.a.get(e,"companySearchResult.status",-1)?null:r.a.createElement(R,{results:e.companySearchResult}),y.a.get(e,"symbolSearchResult.status",-1)?null:r.a.createElement(z,{results:e.symbolSearchResult}))}}]),t}(r.a.Component),B={container:{margin:20}},K=(r.a.Component,a(99)),J=K.Stitch,V=K.RemoteMongoClient,Q=K.UserApiKeyCredential,G=function(){function e(){Object(s.a)(this,e),this.db={},this.sc={}}return Object(o.a)(e,[{key:"init",value:function(){var e=Object(q.a)(P.a.mark((function e(){var t;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.initClientForAppId("filings-uypee"),e.next=4,this.loginUsingApiKey("pv8Ad54AZcKhdyV13AjL0522JOMTGR3H95FKraLkD7iQWJKTdBOoVuE3x8JhIvB8");case 4:return e.next=6,this.initServiceClient("mongodb-atlas");case 6:return t=e.sent,e.next=9,this.initDBFromServiceClient("filings",t);case 9:return e.abrupt("return",0);case 12:return e.prev=12,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",e.t0);case 16:case"end":return e.stop()}}),e,this,[[0,12]])})));return function(){return e.apply(this,arguments)}}()},{key:"initClientForAppId",value:function(e){this.client=J.initializeDefaultAppClient(e)}},{key:"loginUsingApiKey",value:function(e){var t=new Q("pv8Ad54AZcKhdyV13AjL0522JOMTGR3H95FKraLkD7iQWJKTdBOoVuE3x8JhIvB8");return this.client.auth.loginWithCredential(t).then((function(e){return console.log("Logged into Stitch client as API user (server) with id: ".concat(e.id)),e})).catch((function(e){return console.error(e),e}))}},{key:"initServiceClient",value:function(){var e=Object(q.a)(P.a.mark((function e(t){return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.client.getServiceClient(V.factory,t);case 2:return this.sc[t]=e.sent,e.abrupt("return",this.sc[t]);case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"initDBFromServiceClient",value:function(){var e=Object(q.a)(P.a.mark((function e(t,a){return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.db(t);case 2:return this.db[t]=e.sent,e.abrupt("return",this.db[t]);case 4:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"callFunction",value:function(e,t){return this.client.callFunction(e,t).catch((function(e){return console.error(e),e}))}}]),e}(),Z=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={window:{width:0,height:0},stitchInitialized:!1,loading:!0},a.stitch=new G,a._updateWindowDimensions=a._updateWindowDimensions.bind(Object(h.a)(a)),a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"_updateWindowDimensions",value:function(){this.setState({window:{width:window.innerWidth,height:window.innerHeight}})}},{key:"componentDidMount",value:function(){var e=this;this._updateWindowDimensions(),window.addEventListener("resize",this._updateWindowDimensions),console.log("Initializing Stitch ..."),this.stitch.init().then((function(t){t?(console.error("Stitch initialization error:",t),e.setState({stitchInitialized:!1,loading:!1})):(console.log("Stitch initialization complete!"),e.setState({stitchInitialized:!0,loading:!1}))})).catch((function(t){console.error("Stitch initialization error:",t),e.setState({stitchInitialized:!1,loading:!1})}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this._updateWindowDimensions)}},{key:"render",value:function(){var e=this;return r.a.createElement(m.a,{basename:"/holdings"},r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-body"},this.state.stitchInitialized||this.state.loading?null:"Error connecting to MongoDB Stitch!",!this.state.stitchInitialized&&this.state.loading?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{minHeight:"30vh"}}),"Connecting to MongoDB Stitch server ..."):r.a.createElement(r.a.Fragment,null,r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/holdings/:cik?",render:function(t){return r.a.createElement(F,Object.assign({},t,{stitch:e.stitch,stitchInitialized:e.state.stitchInitialized}))}}),r.a.createElement(g.a,{path:"/holders/:cusip?",render:function(t){return r.a.createElement(I,Object.assign({},t,{stitch:e.stitch,stitchInitialized:e.state.stitchInitialized}))}}))))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(Z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},72:function(e,t,a){e.exports=a(100)},77:function(e,t,a){},78:function(e,t,a){}},[[72,1,2]]]);
//# sourceMappingURL=main.6cc8bb17.chunk.js.map