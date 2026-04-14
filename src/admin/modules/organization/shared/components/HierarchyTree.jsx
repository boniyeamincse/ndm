import TreeNode from './TreeNode';

export default function HierarchyTree({ nodes = [], renderLabel }) {
  return (
    <div className="org-tree">
      {nodes.map((node) => (
        <TreeNode key={node.id || node.uuid} node={node} renderLabel={renderLabel} />
      ))}
    </div>
  );
}
