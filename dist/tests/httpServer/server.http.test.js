import{features as r}from"/Users/adam/Code/testeranto.ts/tests/httpServer/../testerantoFeatures.test.ts";import{HttpTesteranto as u}from"/Users/adam/Code/testeranto.ts/tests/httpServer/./http.testeranto.test.ts";import{serverFactory as m}from"/Users/adam/Code/testeranto.ts/tests/httpServer/./server.ts";var o=r.hello,n=u({Suites:{Default:"some default Suite"},Givens:{AnEmptyState:()=>({})},Whens:{PostToStatus:t=>()=>["put_status",t],PostToAdd:t=>()=>["put_number",t.toString()]},Thens:{TheStatusIs:t=>()=>["get_status",t],TheNumberIs:t=>()=>["get_number",t]},Checks:{AnEmptyState:()=>({})}},(t,a,e,s,S)=>[t.Default("Testing the Node server with fetch",[a.AnEmptyState("a http boringfeature",[o],[],[s.TheStatusIs("some great status")]),a.AnEmptyState("a http feature",[o],[e.PostToStatus("hello")],[s.TheStatusIs("hello")]),a.AnEmptyState("a httpfeature",[o],[e.PostToStatus("hello"),e.PostToStatus("aloha")],[s.TheStatusIs("aloha")]),a.AnEmptyState("a feature",[o],[],[s.TheNumberIs(0)]),a.AnEmptyState("a httpfeature",[o],[e.PostToAdd(1),e.PostToAdd(2)],[s.TheNumberIs(3)]),a.AnEmptyState("another http feature",[o],[e.PostToStatus("aloha"),e.PostToAdd(4),e.PostToStatus("hello"),e.PostToAdd(3)],[s.TheStatusIs("hello"),s.TheNumberIs(7)])],[])],m,__filename);export{n as ServerHttpTesteranto};
