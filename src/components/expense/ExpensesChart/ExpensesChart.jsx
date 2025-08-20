import { useContext, useEffect, useMemo, useState } from 'react'
import {
	Bar,
	BarChart,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { ExpenseContext } from '../../../provider/ExpenseProvider'
import styles from './ExpensesChart.module.scss'

const CATEGORY_META = {
	food: { name: 'Еда', color: '#d9b3ff' },
	transport: { name: 'Транспорт', color: '#ffb84d' },
	housing: { name: 'Жилье', color: '#66e0ff' },
	joy: { name: 'Развлечения', color: '#a6a6ff' },
	education: { name: 'Образование', color: '#ccff33' },
	others: { name: 'Другое', color: '#ffb3b3' },
}

const RU_MONTHS = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
]
const RU_MONTHS_GEN = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

const monthIndexFromRu = name => {
	if (!name) return 0
	const idx = RU_MONTHS.findIndex(
		m => m.toLowerCase() === String(name).toLowerCase()
	)
	return idx >= 0 ? idx : 0
}

const toDate = x => {
	if (!x) return null
	if (x instanceof Date)
		return new Date(x.getFullYear(), x.getMonth(), x.getDate())
	const d = new Date(x)
	return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const isSameDay = (d1, d2) =>
	d1 &&
	d2 &&
	d1.getFullYear() === d2.getFullYear() &&
	d1.getMonth() === d2.getMonth() &&
	d1.getDate() === d2.getDate()

const formatRuGenitive = d =>
	`${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`

// ---- Респонсивная толщина столбцов (мобилка 52..62 px) ----
const MIN_BAR_SIZE = 52
const MAX_BAR_SIZE = 62
const MOBILE_MIN_W = 320
const MOBILE_MAX_W = 672

function useMobileBarSize() {
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' ? window.innerWidth <= MOBILE_MAX_W : false
	)
	const [barSize, setBarSize] = useState(MIN_BAR_SIZE)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const calc = () => {
			const w = window.innerWidth
			const mobile = w <= MOBILE_MAX_W
			setIsMobile(mobile)

			if (mobile) {
				const clamped = Math.max(MOBILE_MIN_W, Math.min(w, MOBILE_MAX_W))
				const t = (clamped - MOBILE_MIN_W) / (MOBILE_MAX_W - MOBILE_MIN_W) // 0..1
				const px = Math.round(MIN_BAR_SIZE + (MAX_BAR_SIZE - MIN_BAR_SIZE) * t)
				setBarSize(px)
			} else {
				setBarSize(undefined)
			}
		}

		calc()
		window.addEventListener('resize', calc)
		return () => window.removeEventListener('resize', calc)
	}, [])

	return { isMobile, barSize }
}

function ellipsize(str, maxChars) {
	if (!str) return ''
	return str.length > maxChars ? str.slice(0, maxChars) + '…' : str
}

export default function ExpensesChart({ date, range }) {
	const { expenses } = useContext(ExpenseContext)

	const { isMobile, barSize } = useMobileBarSize()

	const normRange = useMemo(() => {
		if (!range) return null
		const s = toDate(range.startDate)
		const e = toDate(range.endDate)
		return s && e ? { start: s, end: e } : null
	}, [range?.startDate, range?.endDate])

	const filtered = useMemo(() => {
		const items = Array.isArray(expenses) ? expenses : []
		if (normRange) {
			return items.filter(t => {
				const d = toDate(t.date)
				return d && d >= normRange.start && d <= normRange.end
			})
		}
		if (date?.day && date?.month && date?.year) {
			const target = new Date(
				Number(date.year),
				monthIndexFromRu(date.month),
				Number(date.day)
			)
			return items.filter(t => isSameDay(toDate(t.date), target))
		}
		return items
	}, [
		expenses,
		normRange?.start?.getTime(),
		normRange?.end?.getTime(),
		date?.day,
		date?.month,
		date?.year,
	])

	const computed = useMemo(() => {
		const acc = new Map()
		for (const t of filtered) {
			const key = t.category
			const sum = Number(t.sum) || 0
			acc.set(key, (acc.get(key) || 0) + sum)
		}
		return Object.entries(CATEGORY_META).map(([apiKey, meta]) => ({
			name: meta.name,
			value: acc.get(apiKey) || 0,
			color: meta.color,
		}))
	}, [filtered])

	const subtitleNode = useMemo(() => {
		if (normRange) {
			return (
				<>
					Расходы за <strong>{formatRuGenitive(normRange.start)}</strong> —{' '}
					<strong>{formatRuGenitive(normRange.end)}</strong>
				</>
			)
		}
		if (date?.day && date?.month && date?.year) {
			const d = new Date(
				Number(date.year),
				monthIndexFromRu(date.month),
				Number(date.day)
			)
			return (
				<>
					Расходы за <strong>{formatRuGenitive(d)}</strong>
				</>
			)
		}
		return (
			<>
				Расходы за <strong>весь период</strong>
			</>
		)
	}, [
		normRange?.start?.getTime(),
		normRange?.end?.getTime(),
		date?.day,
		date?.month,
		date?.year,
	])

	const total = computed.reduce((s, x) => s + (x?.value || 0), 0)

	const maxLabelChars = isMobile
		? (barSize || MIN_BAR_SIZE) <= 54
			? 5
			: (barSize || MIN_BAR_SIZE) <= 58
				? 6
				: 7
		: 99

	return (
		<div className={styles.container}>
			<h2 className={styles.total}>{total.toLocaleString('ru-RU')} ₽</h2>
			<p className={styles.subtitle}>{subtitleNode}</p>
			<div className={styles.graph__container}>
				<ResponsiveContainer
					width='100%'
					height={424}
					padding-left='{32px}'
					padding-right='32px}'
				>
					<BarChart data={computed} barCategoryGap='10%'>
						<XAxis
							dataKey='name'
							tick={{ fontSize: isMobile ? 10 : 12 }}
							axisLine={false}
							tickLine={false}
							interval={0}
							tickMargin={8}
							tickFormatter={v => (isMobile ? ellipsize(v, maxLabelChars) : v)}
						/>
						<YAxis hide domain={[0, max => max * 1.1]} />
						<Bar
							dataKey='value'
							radius={[12, 12, 12, 12]}
							maxBarSize={520}
							barSize={barSize}
						>
							{computed.map((entry, index) => (
								<Cell key={index} fill={entry.color} />
							))}
							<LabelList
								dataKey='value'
								position='top'
								formatter={v => `${Number(v).toLocaleString('ru-RU')} ₽`}
								fill='#000'
								fontSize={16}
								fontWeight={600}
								fontFamily='Montserrat, Arial, sans-serif'
								fontStyle='normal'
							/>
						</Bar>
						<Tooltip
							formatter={v => [
								`${Number(v).toLocaleString('ru-RU')} ₽`,
								'Сумма',
							]}
							cursor={{ fill: 'rgba(0,0,0,0.04)' }}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
