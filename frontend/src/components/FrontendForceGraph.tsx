import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ForceGraph2D } from "react-force-graph"; // important to load this component dynamically with ssr false into NextJS to make sure we render / compile in the browser
import { INCREMENT_PAUSE, NODE_REL, Router, Selectable, Selected } from "../constants";

interface FrontendForceGraphProperties {
  data: Router[];
  trace: string[];
  onSelect: (selected: Selected) => void;
}

export const FrontendForceGraph: React.FC<FrontendForceGraphProperties> = ({ data, trace, onSelect }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [traceNodes, setTraceNodes] = useState(new Set<string>());
  const [traceLinks, setTraceLinks] = useState(new Set());

  const graphData = useMemo(
    () => ({
      nodes: data.map((router) => ({
        id: router.identifier,
        name: router.name,
        value: Math.min(255, router.interfaces.length * 50),
      })),
      links: data.flatMap((router) => {
        return router.interfaces.map((intf) => ({
          id: router.name + "_" + intf.name,
          display: "Interface from " + router.name + " to " + intf.name,
          name: intf.name,
          source: router.identifier,
          target: intf.identifier,
        }));
      }),
    }),
    [data]
  );

  // incrementally highlight shortest path
  useEffect(() => {
    if (trace.length === 0) {
      traceNodes.clear();
      traceLinks.clear();
      return;
    }

    (async () => {
      const acc = trace;
      let last;
      while (acc.length !== 0) {
        const curr = acc.shift()!;
        if (last) {
          traceLinks.add(last + "_" + curr);
          setTraceLinks(traceLinks);
        }
        traceNodes.add(curr);
        setTraceNodes(traceNodes);

        last = curr;
        await new Promise((resolve) => setTimeout(resolve, INCREMENT_PAUSE));
      }
    })();
  }, [trace]);

  const paintRing = useCallback(
    (node: any, ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      if (selectedNode && selectedNode === node) {
        ctx.arc(node.x, node.y, NODE_REL * 1.3, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#ff8400";
        ctx.fill();
        return;
      } else if (hoveredNode && hoveredNode === node) {
        const progress = node.progress ? node.progress : 0;
        node.progress = progress > 2 * Math.PI ? 0 : progress + Math.PI / 64;
        ctx.arc(node.x, node.y, NODE_REL * 1.2, progress, progress + Math.PI / 2, false);
        ctx.strokeStyle = "#ff8400";
        ctx.lineWidth = 1;
        ctx.stroke();
        return;
      }
      const progress = node.progress ? node.progress : NODE_REL;
      if (progress > NODE_REL * 1.4) {
        node.add = false;
      } else if (progress <= NODE_REL) {
        node.add = true;
      }

      node.progress = progress + (node.add ? 0.02 : -0.02);
      ctx.arc(node.x, node.y, progress, 0, 2 * Math.PI, false);
      ctx.fillStyle = "orange";
      ctx.fill();
    },
    [selectedNode, hoveredNode]
  );

  // @ts-ignore (because react-force-graph cannot properly define or export their ts types -,-)
  const objectMode = (node: NodeObject): CanvasCustomRenderMode => {
    return node === selectedNode || node === hoveredNode || traceNodes.has(node.name) ? "before" : "none";
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      nodeRelSize={NODE_REL}
      nodeColor={(node: any) => rgbToHex(node.value, 0, 0)}
      nodeCanvasObjectMode={objectMode}
      nodeCanvasObject={paintRing}
      linkLabel="display"
      linkColor={(link: any) => (traceLinks.has(link.id) ? "red" : "black")}
      linkWidth={(link: any) => (traceLinks.has(link.id) ? 2 : 1)}
      linkDirectionalArrowLength={8}
      linkDirectionalArrowRelPos={1}
      linkDirectionalArrowColor={(link: any) => (traceLinks.has(link.id) ? "transparent" : "orange")}
      linkDirectionalParticles={4}
      linkDirectionalParticleWidth={(link: any) => (traceLinks.has(link.id) ? 4 : 0)}
      onNodeClick={(node: any) => {
        setSelectedNode(node);
        onSelect({ type: Selectable.ROUTER, ...node });
      }}
      onNodeHover={(node: any) => setHoveredNode(node)}
      onLinkClick={(link: any) => onSelect({ type: Selectable.LINK, ...link })}
      backgroundColor="white"
      width={800}
      height={600}
    />
  );
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export default FrontendForceGraph;

/* possible solution is to make this "memo"ized (meaning it does only update upon internal state change and not every time the parent updates as is the default behaviour) */
/* react implements a basic shallow comparision between old and current state to determine if an update is necessary when using React.memo without arePropsEqual */
/* => there is also the possibility to implement the arePropsEqual function as second argument to have finer control on when an update is needed (updates when arePropsEqual is false) */
/* be aware that () => {} always creates a new function! (use useCallback hook to prevent this) */
// export default React.memo(FrontendForceGraph, (prevProps, nextProps) => {
//   if (prevProps.data.length !== nextProps.data.length) {
//     return false;
//   }
//   return true;
// });
