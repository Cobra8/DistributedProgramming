import React from "react";
import { ForceGraph2D } from "react-force-graph"; // important to load this component dynamically with ssr false into NextJS to make sure we render / compile in the browser
import { Router, Selectable, Selected } from "../constants";

interface FrontendForceGraphProperties {
  data: Router[];
  onSelect: (selected: Selected) => void;
}

export const FrontendForceGraph: React.FC<FrontendForceGraphProperties> = ({ data, onSelect }) => {
  const graphData = {
    nodes: data.map((router) => ({
      id: router.identifier,
      name: router.name,
      value: Math.min(255, router.interfaces.length * 50),
    })),
    links: data.flatMap((router) => {
      return router.interfaces.map((intf) => ({
        id: intf.name + "_" + intf.identifier,
        display: "Interface from " + router.name + " to " + intf.name,
        name: intf.name,
        source: router.identifier,
        target: intf.identifier,
      }));
    }),
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      linkLabel="display"
      linkDirectionalArrowLength={7}
      linkDirectionalArrowRelPos={1}
      linkDirectionalArrowColor={() => "#00b5d8"}
      onNodeClick={(node: any) => onSelect({ type: Selectable.ROUTER, ...node })}
      onLinkClick={(link: any) => onSelect({ type: Selectable.LINK, ...link })}
      nodeColor={(node: any) => rgbToHex(node.value, 0, 0)}
      linkColor={() => "black"}
      // autoPauseRedraw={false}
      backgroundColor="white"
      width={800}
      height={600}
    />
  );
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/* important to make this "memo"ized (meaning it does only update upon internal state change and not every time the parent updates as is the default behaviour) */
/* react implements a basic shallow comparision between old and current state to determine if an update is necessary when using React.memo without arePropsEqual */
/* => there is also the possibility to implement a function as second argument (arePropsEqual) to have finer control on when an update is needed (updates when arePropsEqual is false) */
/* be aware that () => {} always creates a new function! (use useCallback hook to prevent this) */
export default React.memo(FrontendForceGraph, (prevProps, nextProps) => {
  if (prevProps.data.length !== nextProps.data.length) {
    return false;
  } else if (prevProps.onSelect !== nextProps.onSelect) {
    return false;
  }
  return true; // could additionally check for data content?
});
