import React from 'react';

const ShowMoreHandler = ({
  check,
  setCheck,
  _id,
  toggle,
  elementData,
  keyName,
}) => {
  const expandHandleChange = (_id, toggle) => {
    let activeData = check?.map(item => {
      if (item._id === _id) {
        return { ...item, [keyName]: toggle };
      }
      return item;
    });
    setCheck(activeData);
  };
  return (
    <>
      {elementData?.length > 30 ? (
        <span
          className="show_more text_primary"
          onClick={() => expandHandleChange(_id, !toggle, 'active')}
        >
          {elementData !== ''
            ? toggle === false
              ? 'Show More'
              : 'Show Less'
            : ''}
        </span>
      ) : (
        ''
      )}
    </>
  );
};

export default ShowMoreHandler;
