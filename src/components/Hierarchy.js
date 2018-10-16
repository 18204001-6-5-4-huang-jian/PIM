// import React from 'react'
// import { Button } from 'antd'
// import ReactGridLayout from 'react-grid-layout'
// import { Graph, NodeMapper, G6 } from 'g6-for-react';
// const getTreeData = function getTreeData(x1, y1, angle, depth) {
//     const nodes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
//     const edges = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

//     const deg_to_rad = Math.PI / 180;
//     if (depth !== 0) {
//         const x2 = x1 + Math.cos(angle * deg_to_rad) * depth * 10.0;
//         const y2 = y1 + Math.sin(angle * deg_to_rad) * depth * 10.0;
//         const id1 = G6.Util.guid();
//         const id2 = G6.Util.guid();
//         nodes.push({
//             id: id1,
//             x: x1,
//             y: y1
//         });
//         nodes.push({
//             id: id2,
//             x: x2,
//             y: y2
//         });
//         edges.push({
//             source: id1,
//             target: id2
//         });
//         getTreeData(x2, y2, angle - 30, depth - 1, nodes, edges);
//         getTreeData(x2, y2, angle + 30, depth - 1, nodes, edges);
//     }
//     return {
//         nodes: nodes,
//         edges: edges
//     };
// };

// class Hierachy extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             colors: ['#77151C', '#871A20', '#871A20', '#A82327', '#B5322C', '#BE462F', '#CA6434', '#DE903D', '#F2BE46', '#FCDF7F', '#FEF5DA', '#BDEAFF', '#4BDCFF', '#1DE2FF', '#10D8E1', '#1CBB9E', '#1CBB9E', '#22AC7C', '#289F5E', '#1A8747', '#147D3F'],
//             text: 'Hierachy',
//             data: getTreeData(0, 0, -90, 9)
//         }
//     }
//     componentDidMount() {
//         console.log(this.props);
//     }
//     render() {
//         const listTab = this.state.colors.map((item, index) => {
//             return <Button key={index} type="primary" style={{ background: item }}>{index}</Button>
//         })
//         const layout = [
//             { i: 'a', x: 0, y: 0, w: 1, h: 2, static: false },
//             { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//             { i: 'c', x: 4, y: 0, w: 1, h: 2 }
//         ];
//         return (
//             <div className='hierachy-container' style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '22px', color: 'red' }}>{this.state.text}</div>
//                 {listTab}
//                 {/* react-grid-layout */}
//                 <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200} style={{ marginTop: '50px', fontSize: '30px' }}>
//                     <div key="a" style={{ border: '1px solid red' }}>a</div>
//                     <div key="b" style={{ border: '1px solid red' }}>b</div>
//                     <div key="c" style={{ border: '1px solid red' }}>c</div>
//                 </ReactGridLayout>
//                 {/* g6 */}
//                 <div className="graph">
//                     <div className="graph-basic">
//                         <Graph fitView="cc" animate={true} height={window.innerHeight} data={this.state.data}>
//                             <NodeMapper size={2} />
//                         </Graph>
//                     </div>
//                 </div>
//             </div >
//         )
//     }
// }
// export default Hierachy