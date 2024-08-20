import React, {useState } from 'react'
import NickName from '../pages/initialSetup/NickName';

interface Props {
  to:  React.ReactElement;
}

const ProtectedRoute: React.FC<Props> =({to}) => {
  const [auth]=useState(true)
  if(auth){
    return to;
  }else{
    return <NickName/>
  }
}
export default ProtectedRoute
