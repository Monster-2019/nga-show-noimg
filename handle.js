const rs = history.replaceState

window.addEventListener('load', replaceNoImg)

history.replaceState = function () {
	rs.apply(history, arguments) // preserve normal functionality
	if (arguments[1] !== arguments[2]) replaceNoImg()
}
const IMG_BASE = 'https://img.nga.178.com/attachments'
const IMG_TEMPLATE = `<img style="max-height: none; min-width: 640px; max-width: 790px; outline: rgb(175, 198, 207) solid 5px; outline-offset: -5px;" onload="ubbcode.adjImgSize(this,583.4);" onerror="ubbcode.imgError(this)" onclick="" _orgt="0" src="MEDIUM" data-argi="2" data-srcorg="ORIGIN" data-usethumb="MEDIUM" data-srclazy="" data-apporg="" data-appthumb="" _haveorg="1" alt="">`

const noimgReg = /\[noimg\](.+?)\.jpg\[\/noimg\]/g

function getImgData(postDataString) {
	const [y, m, d] = postDataString.slice(0, 10).split('-')
	return `/mon_${y}${m}/${d}/`
}

function getImgHTML(imgId, url_data) {
	const ORIGIN = IMG_BASE + url_data + imgId
	return IMG_TEMPLATE.replaceAll('MEDIUM', ORIGIN + '.medium.jpg').replaceAll('ORIGIN', ORIGIN)
}

function replaceNoImg() {
	const tables = document.querySelectorAll('#m_posts_c > table')
	Array.from(tables).forEach((table, i) => {
		if (table.dataset.noimg) {
			return
		} else {
			if (noimgReg.test(table.innerText)) {
				table.dataset.noimg = 1
				let data = table.querySelector('.postinfot.postdatec.stxt')
				const url_data = getImgData(data.innerText)
				let replyEl = table.querySelector('.postcontent.ubbcode')
				const noImgs = Array.from(replyEl.childNodes).filter(
					t => t.nodeType === 3 && t.textContent.includes('[noimg]')
				)
				const newInnerHtml = noImgs.forEach(noimg => {
					const noimgSrcList = noimg.textContent.match(noimgReg)
					let noimg_html = noimgSrcList.reduce((html, cur) => {
						return html + getImgHTML(cur.slice(9, -8), url_data) + '\n<br />\n'
					}, '')
					let divEl = document.createElement('div')
					divEl.innerHTML = noimg_html
					noimg.replaceWith(divEl)
				})
			} else {
				table.dataset.noimg = 0
			}
		}
	})
}
