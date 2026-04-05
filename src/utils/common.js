import GetCookies from 'hooks/GetCookies';

/*positive number validation */

export const numberRegex = e => {
  if (e.key === '+' || e.key === '-') {
    e.preventDefault();
  }
};
export const numberRegexE = e => {
  if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
    e.preventDefault();
  }
};
export const getSessionValue = () => {
  const sessionData = GetCookies('TokenCRM');
  if (sessionData) {
    return true;
  } else {
    return false;
  }
};
const getPageListData = (pagesList, activePage, pageSize) => {
  const currentDataList = pagesList?.slice(
    0 + (activePage * pageSize - pageSize),
    activePage * pageSize,
  );
  return currentDataList;
};

export const getPaginationData = (
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
    currentDataList = getPageListData(pagesList, activePage - 1, pageSize);
  } else {
    currentDataList = getPageListData(pagesList, activePage, pageSize);
  }
  return currentDataList;
};

export const getTotalPages = (pageList, pageSize) => {
  const totalPages = Math.ceil(pageList?.length / pageSize);
  return totalPages;
};

export const suspendHandler = (itemObj, dispatch, updateDispatch, objKey) => {
  dispatch(
    updateDispatch({
      _id: itemObj._id,
      [objKey]: {
        ...itemObj,
        is_active: !itemObj.is_active,
      },
    }),
  );
};

export const totalCount = (data, key) => {
  return data.reduce((sum, cuurent) => {
    if (Object.keys(cuurent).includes(key)) {
      return sum + Number(cuurent[key]);
    } else {
      return sum;
    }
  }, 0);
};

export const userHasPermission = (user, perms = [], all = false) => {
  if (!user || !perms || !Array.isArray(perms)) {
    return false;
  }

  if (all) {
    return perms.every(perm => user[perm]);
  } else {
    return perms.some(perm => user[perm]);
  }
};

export const toMoney = (value = 0) => {
  return value ? parseFloat(value).toFixed(2) : '0.00';
};

// accept .00 digit
export const zeroRoundTo = (value, digits = 2) => {
  if (digits === undefined) {
    digits = 0;
  }

  let multiplicator = Math.pow(10, digits);
  value = parseFloat((value * multiplicator).toFixed(11));
  return (Math.round(value) / multiplicator).toFixed(2);
};

// remove .00 digit
export const toRound = (value = 0) => {
  return Math.round(value * 100) / 100;
};
export const applyDiscount = (am = 0, discPerc = 0) => {
  return toRound((am * (100 - discPerc)) / 100);
};
export const getPreTax = (gross, tax) => {
  return toRound((parseFloat(gross) / (100 + parseFloat(tax))) * 100);
};
export const addTax = (net, tax) => {
  return toRound((parseFloat(net) * (100 + parseFloat(tax))) / 100);
};

export const formatNumberWithCommas = number => {
  return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function checkEmail(e, bypassVal = false, doDNSlookup = false) {
  let lastError = { checkEmail: false };
  bypassVal = Array?.isArray(bypassVal)
    ? bypassVal
    : typeof bypassVal === 'string'
    ? [bypassVal]
    : bypassVal;

  if (bypassVal && Array?.isArray(bypassVal) && bypassVal?.includes(e)) {
    lastError.checkEmail = 'Bypass Used';
    return true;
  }

  if (Array.isArray(e)) {
    for (let addr of e) {
      if (addr?.indexOf('@') >= addr?.lastIndexOf('.')) {
        lastError.checkEmail = 'Invalid Email Format';
        return false;
      }
    }
  } else {
    if (e.indexOf('@') >= e.lastIndexOf('.')) {
      lastError.checkEmail = 'Invalid Email Format';
      return false;
    }
  }

  let isValid = /@.+\./.test(e);

  if (!isValid) {
    lastError.checkEmail = 'Invalid Email Address';
  }

  if (isValid && doDNSlookup) {
    if (!hasValidMatchingDNSMX(e)) {
      isValid = false;
      lastError.checkEmail = 'Invalid DNS';
    }
  }

  return isValid;
}
function hasValidMatchingDNSMX(e) {
  return true;
}

export function capitalizeSentence(sentence) {
  if (!sentence) return ''; // Return empty string if sentence is falsy
  const words = sentence.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(' ');
}

export const checkUserPermissions = userPermissionDetail => {
  return userPermissionDetail;
};

export const filterChangedFormFields = obj => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== '') acc[key] = obj[key];
    return acc;
  }, {});
};

export const filterOnlyUpdatedFields = (originalData, updatedData) => {
  let updatedFields = {};
  for (let key in updatedData) {
    if (updatedData[key] !== originalData[key])
      updatedFields[key] = updatedData[key];
  }
  return updatedFields;
};

export function toBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64Unicode(str) {
  return decodeURIComponent(escape(atob(str)));
}
