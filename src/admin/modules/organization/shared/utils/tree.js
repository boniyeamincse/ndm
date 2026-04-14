export function buildTree(items = [], idKey = 'id', parentKey = 'parent_id') {
  const mapped = new Map();
  const roots = [];

  items.forEach((item) => {
    mapped.set(item[idKey], { ...item, children: [] });
  });

  mapped.forEach((item) => {
    if (item[parentKey] && mapped.has(item[parentKey])) {
      mapped.get(item[parentKey]).children.push(item);
      return;
    }

    roots.push(item);
  });

  return roots;
}
