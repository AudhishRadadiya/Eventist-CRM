import { useMemo, useState } from 'react';
import _ from 'lodash';

export default function useGroupSortable(currentpage, data, config = null) {
  const [groupSortConfig, setGroupSortConfig] = useState(config);
  const groupSortedItems = useMemo(() => {
    let sortableItems = [...data];
    if (
      groupSortConfig !== null &&
      data.length > 0 &&
      groupSortConfig?.currentpage === currentpage
    ) {
      let catNameArr = [];
      let newArray = [];
      data.forEach((item, index) => {
        if (item?.catName) {
          if (catNameArr?.length === 0 && newArray.length === 0) {
            catNameArr.push(item);
            return item;
          } else if (newArray?.length === 1) {
            catNameArr.push(newArray[0]);
            catNameArr.push(item);
            newArray = [];
          } else if (newArray?.length > 1) {
            const sortedData = _.orderBy(
              newArray,
              [groupSortConfig?.key],
              groupSortConfig?.direction,
            );
            catNameArr.push(...sortedData);
            catNameArr.push(item);
            newArray = [];
          }
        } else {
          if (catNameArr.length > 0) {
            newArray.push(item);
            if (index + 1 === data?.length) {
              const sortedData = _.orderBy(
                newArray,
                [groupSortConfig?.key],
                groupSortConfig?.direction,
              );
              catNameArr.push(...sortedData);
            }
          } else {
            newArray.push(item);
          }
        }
      });
      if (catNameArr.length === 0 && newArray.length > 0) {
        const sortedData = _.orderBy(
          newArray,
          [groupSortConfig?.key],
          groupSortConfig?.direction,
        );
        catNameArr.push(...sortedData);
      }
      return catNameArr;
    }
    return sortableItems;
  }, [currentpage, data, groupSortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (groupSortConfig?.key === key && groupSortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setGroupSortConfig({ key, direction, currentpage });
  };
  return {
    itemsActive: groupSortedItems,
    itemsInActive: groupSortedItems,
    requestSortActive: requestSort,
    requestSortInActive: requestSort,
    groupSortConfig,
  };
}
