/** The "see the full version" button: a palm-leaf note saying how to ask for the full dashboard. The contact line comes from study.json. */
export function initFull() {
  const btn = document.getElementById('fullBtn') as HTMLButtonElement
  const dlg = document.getElementById('fullDlg') as HTMLDialogElement
  btn.addEventListener('click', () => dlg.showModal())
  ;(document.getElementById('fullClose') as HTMLElement).addEventListener('click', () => dlg.close())
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close() }) // a tap on the backdrop closes it
}
