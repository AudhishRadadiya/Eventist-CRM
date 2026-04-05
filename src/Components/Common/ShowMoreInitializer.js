import React, { useEffect } from 'react';

const ShowMoreInitializer = ({ data, setState }) => {
  useEffect(() => {
    if (data?.length > 0) {
      let newDataList = [];
      data.map(i => {
        newDataList.push({
          ...i,
          show_more: false,
          show_more_info: false,
          show_more_note: false,
        });
        return {
          ...i,
          show_more: false,
          show_more_info: false,
          show_more_note: false,
        };
      });
      setState(newDataList);
    }
  }, [data]);
};

export default ShowMoreInitializer;
