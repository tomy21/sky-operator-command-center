import { useState } from 'react';
import { toast } from 'react-toastify';
import { changeStatusGate } from '@/hooks/useIOT';
import { fetchNewTransaction, createTransaction, sendWhatsApp } from '@/hooks/useTransaction';
import { addIssue } from '@/hooks/useIssues';

// Remove unused imports
// import { validateLicensePlate } from '@/utils/validationNumberPlat';
// import { validateWhatsAppNumber } from '@/utils/formatPhoneNumber';

// Add proper type for issue data
interface IssueData {
  idCategory?: number;
  idGate?: number;
  description?: string;
  action?: string;
  foto?: string;
  number_plate?: string;
  TrxNo?: string;
}

export function useCallManagement() {
  const [isOpeningGate, setIsOpeningGate] = useState(false);
  const [isCreateIssue, setIsCreateIssue] = useState(false);
  const [isSearchingTransaction, setIsSearchingTransaction] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  
  const handleOpenGate = async (gateId: number, action: "OPEN" | "CLOSE") => {
    try {
      setIsOpeningGate(true);
      const response = await changeStatusGate(gateId, action);
      toast.success(response.message);
      return response;
    } catch (error: unknown) {
      console.error('Error opening gate:', error);
      toast.error('Gagal membuka gate');
      throw error;
    } finally {
      setIsOpeningGate(false);
    }
  };

  const handleSearchTransaction = async (plateNumber: string, locationId: string | number) => {
    try {
      setIsSearchingTransaction(true);
      const response = await fetchNewTransaction(plateNumber, locationId);
      return response;
    } catch (error: unknown) {
      console.error('Error searching transaction:', error);
      toast.error('Gagal mencari transaksi');
      throw error;
    } finally {
      setIsSearchingTransaction(false);
    }
  };

  const handleCreateTransaction = async (plateNumber: string) => {
    try {
      const response = await createTransaction(plateNumber);
      toast.success('Transaksi berhasil dibuat');
      return response;
    } catch (error: unknown) {
      console.error('Error creating transaction:', error);
      toast.error('Gagal membuat transaksi');
      throw error;
    }
  };

  const handleCreateIssue = async (issueData: IssueData) => {
    try {
      setIsCreateIssue(true);
      const response = await addIssue(issueData);
      toast.success('Issue berhasil dibuat');
      return response;
    } catch (error: unknown) {
      console.error('Error creating issue:', error);
      toast.error('Gagal membuat issue');
      throw error;
    } finally {
      setIsCreateIssue(false);
    }
  };

  const handleSendWhatsApp = async (phoneNumber: string) => {
    try {
      setIsSendingWhatsApp(true);
      const response = await sendWhatsApp(phoneNumber);
      toast.success('WhatsApp berhasil dikirim');
      return response;
    } catch (error: unknown) {
      console.error('Error sending WhatsApp:', error);
      toast.error('Gagal mengirim WhatsApp');
      throw error;
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  return {
    isOpeningGate,
    isCreateIssue,
    isSearchingTransaction,
    isSendingWhatsApp,
    handleOpenGate,
    handleSearchTransaction,
    handleCreateTransaction,
    handleCreateIssue,
    handleSendWhatsApp,
  };
}