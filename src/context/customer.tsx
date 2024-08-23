
import { createContext, FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';
import {Customer} from '../types/interface';

import { getCustomer } from '../api/search';
import {getGraphQL} from "../api/graphql";
import {ADD_TO_CART} from "../api/mutations";

export interface CustomerAttributesContext {
  customer: Customer;
  initializeCustomer: () => Promise<string|undefined>;
  addToCompare: (sku: string) => Promise<string>;
}

const CustomerContext = createContext({} as CustomerAttributesContext);

const useCustomer = (): CustomerAttributesContext => {
  return useContext(CustomerContext);
};

const CustomerProvider: FunctionComponent = ({ children }) => {
  const [customer, setCustomer] = useState<Customer>({ compare_list: null});

  const initializeCustomer = async (): Promise<string|undefined> => {
    const customerResponse = await getCustomer();

    if (customerResponse.compare_list) {
      setCustomer(customerResponse);
    }
    return customer.compare_list?.uid;
  };

  const addToCompare = async (sku: string) => {
    let compareUid = customer.compare_list?.uid;
    if (!compareUid) {
      compareUid = await initializeCustomer();
    }
    return compareUid + sku;
  };

  const customerContext: CustomerAttributesContext = {
    customer,
    initializeCustomer,
    addToCompare
  };

  return (
    <CustomerContext.Provider value={customerContext}>{children}</CustomerContext.Provider>
  );
};

export { CustomerProvider, useCustomer };
