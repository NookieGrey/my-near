import React, {useEffect, useState} from 'react';
import {Button, Typography} from 'antd';
import {useNear} from "./NearContext";
import {CompactPicker} from 'react-color';

const {Text} = Typography;

function convertBalance(balance: string) {
  return (balance.slice(0, -24) + ',' + balance.slice(-24)).slice(0, 5);
}

function App() {
  const {isInitializedContext, signUp, signIn, signOut, setNearColor} = useNear();
  const [account, setAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState<Record<string, string>>({});
  const [color, setColor] = useState([0, 0, 0]);

  useEffect(() => {
    if (!isInitializedContext) return;

    (async () => {
      const {accountID, accountBalance, color} = await signUp();

      setAccount(accountID);
      setAccountBalance(accountBalance);
      setColor(color);
    })()

  }, [isInitializedContext])

  return (
    <div>
      <div>
        {account && <Text>кошелёк <strong>{account}</strong></Text>}
        <br/>
        {accountBalance.available &&
          <Text>доступно <strong>{convertBalance(accountBalance.available)}</strong> NEAR токенов</Text>}
      </div>
      <br/>
      {account && <CompactPicker
        onChange={async (color) => {
          const result = await setNearColor([color.rgb.r, color.rgb.g, color.rgb.b]);

          setColor(result);
        }}
        color={{r: color[0], g: color[1], b: color[2]}}
      />}
      <br/>
      <br/>
      <div>
        {!account && <Button type="primary" onClick={signIn}>Sign In</Button>}
        {account && <Button type="primary" onClick={() => {
          signOut();
          setAccount("");
          setAccountBalance({});
        }}>Sign Out</Button>}
      </div>
    </div>
  );
}

export default App;
