
const isScrolledIntoView = (el, root = window, pos = false) => {
    const rect = el.getBoundingClientRect()
    const elemTop = rect.top
    const elemBottom = rect.bottom
    const elemHeight = elemBottom - elemTop
    let isVisible = false

    let rh = root.innerHeight || root.clientHeight
    rh = rh - rh/5
    // Only completely visible elements return true:
    // var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight)

    // Partially visible elements return true:
    isVisible = elemTop < rh && elemBottom >= 0
    if (rect.height > rh) return isVisible
    if (!pos) {
        return isVisible
    } else {
        let percents = 0
        if (isVisible && elemBottom >= rh) {
            percents = ((elemHeight - (elemBottom - rh)) * 80) / elemHeight
        }
        if (isVisible && !percents) {
            percents = 100
        }
        return {
            v: isVisible,
            p: percents
        }
    }
}

const anims = []
setTimeout(()=> {
    document.querySelectorAll('.mask-content .mask').forEach(function (el) {
        anims.push(el)
    }) 
    onWindowScroll()
}, 2000)

const onWindowScroll = (e) => {
    const y = window.scrollY

    anims.map(a => {
        let vis = isScrolledIntoView(a, window, true)
        if (vis.v) {
            a.setAttribute('style', `transform: translateX(${vis.p}%)`)
        } else {
            // Allow animations when scroll back to top
            a.removeAttribute('style')
        }
    })
}

window.onscroll = onWindowScroll