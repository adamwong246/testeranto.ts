import n from"assert";import{TesterantoFactory as u}from"/Users/adam/Code/testeranto.ts/tests/Rectangle/../../src/index.ts";import s from"/Users/adam/Code/testeranto.ts/tests/Rectangle/./Rectangle.ts";import{features as a}from"/Users/adam/Code/testeranto.ts/tests/Rectangle/../testerantoFeatures.test.ts";var l=u(s.prototype,(t,e,i,r,h)=>[t.Default("Testing the Rectangle class",[e.Default("test 1",[a.hello],[i.setWidth(4),i.setHeight(9)],[r.getWidth(4),r.getHeight(9)]),e.WidthOfOneAndHeightOfOne("test 2",[],[i.setWidth(4),i.setHeight(5)],[r.getWidth(4),r.getHeight(5),r.area(20),r.AreaPlusCircumference(38)]),e.WidthOfOneAndHeightOfOne("test 3",[a.hola],[i.setHeight(4),i.setWidth(3)],[r.area(12)]),e.WidthOfOneAndHeightOfOne("test 4",[a.hola],[i.setHeight(3),i.setWidth(4),i.setHeight(5),i.setWidth(6)],[r.area(30),r.circumference(22)]),e.WidthOfOneAndHeightOfOne("test 5",[a.gutentag,a.aloha],[i.setHeight(3),i.setWidth(4)],[r.getHeight(3),r.getWidth(4),r.area(12),r.circumference(142)])],[])],{Suites:{Default:"a default suite"},Givens:{Default:()=>new s,WidthOfOneAndHeightOfOne:()=>new s(1,1),WidthAndHeightOf:(t,e)=>new s(t,e)},Whens:{HeightIsPubliclySetTo:t=>e=>e.height=t,WidthIsPubliclySetTo:t=>e=>e.width=t,setWidth:t=>e=>e.setWidth(t),setHeight:t=>e=>e.setHeight(t)},Thens:{AreaPlusCircumference:t=>e=>{n.equal(e.area()+e.circumference(),t)},getWidth:t=>e=>n.equal(e.width,t),getHeight:t=>e=>n.equal(e.height,t),area:t=>e=>n.equal(e.area(),t),prototype:t=>e=>n.equal(1,1),circumference:t=>e=>n.equal(e.circumference(),t)},Checks:{AnEmptyState:()=>({})}},"na",{andWhen:async function(t,e,i){return e()(t),t}},__filename);export{l as RectangleTesteranto};
