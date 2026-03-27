import { create } from 'zustand'
import { SelectedDomain } from '@/types'

interface DomainStore {
  selectedDomain: SelectedDomain | null
  setSelectedDomain: (domain: SelectedDomain | null) => void
}

export const useDomainStore = create<DomainStore>((set) => ({
  selectedDomain: localStorage.getItem('selectedDomain')
    ? JSON.parse(localStorage.getItem('selectedDomain')!)
    : null,

  setSelectedDomain: (domain) => {
    if (domain) {
      localStorage.setItem('selectedDomain', JSON.stringify(domain))
    } else {
      localStorage.removeItem('selectedDomain')
    }
    set({ selectedDomain: domain })
  },
}))
