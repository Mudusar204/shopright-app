import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

type CreateTransactionPayload = {
  amount: number;
  currency_id: number;
  partnerId?: number;
  reference?: string;
  invoiceId?: number[] | undefined;
  providerId?: number;
  providerCode?: string;
};

type InitiatePaymentPayload = {
  reference: string;
  mobile_number: string;
  cnic: string;
};

const getAuthHeaders = () => {
  const odooAdmin = useAuthStore.getState().odooAdmin;
  if (!odooAdmin) {
    throw new Error("Odoo user auth not found");
  }

  return {
    "Content-Type": "application/json",
    "api-key": odooAdmin.api_key,
    login: odooAdmin.login,
    password: odooAdmin.password,
    db: odooAdmin.db,
  };
};

export const createJazzCashTransaction = async (
  payload: CreateTransactionPayload
) => {
  const headers = getAuthHeaders();
  const body = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      amount: payload.amount,
      currency_id: payload.currency_id,
      partner_id: payload.partnerId,
      provider_id: payload.providerId ?? 19,
      reference: payload.reference,
      invoice_id: payload.invoiceId ?? [],
      provider_code: payload.providerCode ?? "jazzcash",
    },
  };

  const response = await axios.post(
    "https://shopright.club/payment/jazzcash/create_transaction",
    body,
    { headers }
  );

  return response.data;
};

export const initiateJazzCashPayment = async (
  payload: InitiatePaymentPayload
) => {
  const headers = getAuthHeaders();
  const body = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      reference: payload.reference,
      mobile_number: payload.mobile_number,
      cnic: payload.cnic,
    },
  };

  const response = await axios.post(
    "https://shopright.club/payment/jazzcash/s2s/initiate",
    body,
    { headers }
  );

  return response.data;
};
