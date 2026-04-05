const getPageListDataActive2 = (
  pagesList,
  activePage,
  pageSize,
  totalPageSize,
) => {
  let arrayList = [];
  let startIndex = 0;
  let endIndex = 0;
  for (let i = 0; i < totalPageSize; i++) {
    if (pagesList?.length > 0) {
      if (startIndex === 0 && endIndex === 0) {
        startIndex = 1 * pageSize - pageSize;
        endIndex = 1 * pageSize;
      }
      let dummyArray = pagesList?.slice(0 + startIndex, endIndex);
      // let xyz = dummyArray.filter(i => i.catName);
      let xyz = dummyArray?.filter(i => i.is_cat);
      if (xyz?.length > 0) {
        let newCatlengthstart = endIndex;
        let newCatlengthend = endIndex + xyz.length;

        let newdummyArray = pagesList?.slice(
          0 + newCatlengthstart,
          newCatlengthend,
        );
        // let finalData = newdummyArray.filter(i => i.catName);
        let finalData = newdummyArray?.filter(i => i.is_cat);
        if (finalData?.length > 0) {
          endIndex = newCatlengthend + finalData?.length;
        } else {
          endIndex = endIndex + xyz?.length;
        }
        if (pagesList?.length > endIndex) {
          let data = pagesList[endIndex - 1];
          let newArr = data?.hasOwnProperty('catName');
          if (newArr) {
            endIndex = endIndex + 1;
          }
        }
        const currentDataList = pagesList?.slice(0 + startIndex, endIndex);
        arrayList.push({
          page: i + 1,
          pageSize: currentDataList?.length,
          currentPageStartIndex: startIndex,
          currentPageEndIndex: endIndex,
        });
        startIndex = endIndex;
        endIndex = startIndex + pageSize;
      } else {
        const currentDataList = pagesList?.slice(0 + startIndex, endIndex);
        arrayList.push({
          page: i + 1,
          pageSize: currentDataList?.length,
          currentPageStartIndex: startIndex,
          currentPageEndIndex: endIndex,
        });
        startIndex = endIndex;
        endIndex = startIndex + pageSize;
      }
    }
  }
  startIndex = 0;
  endIndex = 0;
  return arrayList;
};
export const getPageListData2 = (
  pagesList,
  allPageData,
  activePage,
  totalPageSize,
  setCurrentPage,
  key,
) => {
  let currentDataList = [];
  if (totalPageSize === 0) {
    return [];
  } else if (activePage > totalPageSize) {
    setCurrentPage(key);
    const dummyList = allPageData?.find(data => data.page === activePage);
    currentDataList = pagesList?.slice(
      0 + dummyList?.currentPageStartIndex,
      dummyList?.currentPageEndIndex,
    );
  } else {
    const dummyList = allPageData?.find(data => data.page === activePage);
    currentDataList = pagesList?.slice(
      0 + dummyList?.currentPageStartIndex,
      dummyList?.currentPageEndIndex,
    );
  }
  return currentDataList;
};
export const getAllPageData2 = (
  pagesList,
  activePage,
  pageSize,
  totalPageSize,
  setCurrentPage,
  key,
) => {
  let currentDataList = [];
  if (totalPageSize === 0) {
    return [];
  } else if (activePage > totalPageSize) {
    setCurrentPage(key);
    currentDataList = getPageListDataActive2(
      pagesList,
      activePage - 1,
      pageSize,
      totalPageSize,
    );
  } else {
    currentDataList = getPageListDataActive2(
      pagesList,
      activePage,
      pageSize,
      totalPageSize,
    );
  }
  return currentDataList;
};
