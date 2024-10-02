
import { createContext, FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';
import {CompareList, Customer, RequisitionList} from '../types/interface';

import {getGraphQL, getGraphQLTest} from "../api/graphql";
import {ADD_TO_COMPARE, CREATE_COMPARE_LIST} from "../api/mutations";
import {useStore} from "./store";
import {GET_CUSTOMER_DATA} from "../api/queries";

export interface CustomerAttributesContext {
  customer: Customer;
  initializeCustomer: (apiUrl: string | undefined) => Promise<Customer|undefined>;
  addToCompareGraphQL: (id: number, apiUrl: string | undefined) => Promise<CompareList>;
}

const CustomerContext = createContext({} as CustomerAttributesContext);

const useCustomer = (): CustomerAttributesContext => {
  return useContext(CustomerContext);
};

const getCustomer = async (apiUrl : string | undefined = undefined): Promise<Customer> => {
  const customerResponse = await getGraphQLTest(GET_CUSTOMER_DATA, {}, '', apiUrl);
  return customerResponse?.data?.customer ?? {};
};

const CustomerProvider: FunctionComponent = ({ children }) => {
  const {
    storeViewCode ,
  } = useStore();
  const [customer, setCustomer] = useState<Customer>({});

  const initializeCustomer = async (apiUrl: string | undefined = undefined) => {
    const customerResponse = await getCustomer(apiUrl);

    if (customerResponse.email) {
      setCustomer(customerResponse);
    }
    console.log(customerResponse);
    return customerResponse;
  };

  const createCompareList = async (apiUrl: string | undefined = undefined) => {
    const variables = {
      input: {
        products: []
      }
    };
    const response = await getGraphQLTest(CREATE_COMPARE_LIST, variables, storeViewCode, apiUrl);
    const compareList: CompareList = {
      uid: response?.data?.createCompareList?.uid,
      item_count: response?.data?.createCompareList?.item_count
    };
    if (response?.data?.createCompareList?.uid) {
      setCustomer({...customer, compare_list: compareList});
    }
    return compareList;
  };

  const addToCompareGraphQL = async (id: number, apiUrl: string | undefined = undefined) => {
    let compareUid = customer.compare_list?.uid;
    if (!compareUid) {
      const customer = await initializeCustomer(apiUrl);
      if (customer?.compare_list === null) {
        const compareList = await createCompareList(apiUrl);
        compareUid = compareList.uid;
      }
      if (customer?.compare_list?.uid) {
        compareUid = customer.compare_list.uid;
      }
    }
    if (!compareUid) {
      return {};
    }
    const variables = {
      input: {
        uid: compareUid,
        products: [id]
      }
    };

    const response = await getGraphQLTest(ADD_TO_COMPARE, variables, storeViewCode, apiUrl);
    const compareList: CompareList = {
      uid: response?.data?.addProductsToCompareList?.uid,
      item_count: response?.data?.addProductsToCompareList?.item_count
    };
    return compareList;
  };

  const customerContext: CustomerAttributesContext = {
    customer,
    initializeCustomer,
    addToCompareGraphQL
  };

  return (
    <CustomerContext.Provider value={customerContext}>{children}</CustomerContext.Provider>
  );
};

export { CustomerProvider, useCustomer };
