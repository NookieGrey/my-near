import React, {useEffect, useState} from 'react';
import {Button, Typography} from 'antd';
import {useNear} from "./NearContext";

const {Text} = Typography;

function App() {
  const {isInitializedContext, signUp, signIn, signOut} = useNear();
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (!isInitializedContext) return;

    (async () => {
      const account = await signUp();

      setAccount(account);
    })()
  }, [isInitializedContext])

  return (
    <div>
      <div>
        {!account && <Button type="primary" onClick={signIn}>Sign In</Button>}
        {account && <Button type="primary" onClick={signOut}>Sign Out</Button>}
      </div>
      <div>
        <Text>адреса кошелька {account}</Text><br/>
        <Text>количество токенов NEAR</Text>
      </div>
    </div>
  );
}

export default App;
