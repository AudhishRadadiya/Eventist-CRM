import { useMemo, useState } from 'react';
import _ from 'lodash';

const useSortable = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);
  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems = _.orderBy(
        sortableItems,
        [sortConfig?.key],
        sortConfig?.direction,
      );
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return {
    itemsActive: sortedItems,
    itemsInActive: sortedItems,
    requestSortActive: requestSort,
    requestSortInActive: requestSort,
    sortConfig,
  };
};

export default useSortable;
