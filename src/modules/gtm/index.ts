import TagManager from 'react-gtm-module';
const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_ID || '',
};
TagManager.initialize(tagManagerArgs);

export default TagManager;
