const $ = (id: string) => document.getElementById(id)
const attackButton = $('attack-button') as HTMLButtonElement

function main() {
  const secondTab = window.open('second', '_blank')
  if (!secondTab) {
    alert('Please allow pop-ups for this site to open the second tab.')
    return
  }
  window.location.href = 'https://github.com/jeremy46231/subvert'
}

attackButton.addEventListener('click', main)
