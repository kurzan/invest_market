import styles from './main.module.css';

import { Instruments, FavoriteInstruments } from '../components/instruments/instruments';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FavoriteInstrumentsContext } from '../services/appContext';
import { useContext } from 'react';

export const Main = ({shares, ofz}) => {
  const { favoriteInsruments } = useContext(FavoriteInstrumentsContext);

  return (
    <div className={styles.container}>
      <Tabs>
        <TabList>
          <Tab>Избранное</Tab>
          <Tab>Акции</Tab>
          <Tab>Облигации</Tab>
        </TabList>

        <TabPanel>
          { favoriteInsruments && favoriteInsruments.length && <FavoriteInstruments data={favoriteInsruments} />}
        </TabPanel>
        <TabPanel>
          { shares && <Instruments data={shares} />}
        </TabPanel>
        <TabPanel>
          { ofz && <Instruments data={ofz} />}
        </TabPanel>
      </Tabs>
    </div>
  )
}