import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function TreeNode({ node, renderLabel, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = Boolean(node.children?.length);

  return (
    <div className="org-tree-node">
      <div className="org-tree-node__row">
        {hasChildren ? (
          <button
            type="button"
            className="org-tree-node__toggle"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Collapse tree node' : 'Expand tree node'}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="org-tree-node__spacer" />
        )}
        <div className="org-tree-node__label">{renderLabel(node)}</div>
      </div>

      {hasChildren && open ? (
        <div className="org-tree-node__children">
          {node.children.map((child) => (
            <TreeNode key={child.id || child.uuid} node={child} renderLabel={renderLabel} defaultOpen={false} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
