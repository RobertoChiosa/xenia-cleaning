import { ConfirmModal } from '#components'

export function useConfirm() {
  const modal = useOverlay().create(ConfirmModal)
  return (title: string, description?: string, label?: string): Promise<boolean> =>
    modal.open({ title, description, label }).result
}
