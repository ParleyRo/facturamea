export default {
	template: `
<div class="invoiceContent">
	
	<div class="invoiceHeader">

		<div class="columns is-mobile">

			<div class="column">
				<p class="is-size-5 is-turquoise" v-show="companyData?.[companyFieldsList[0]]">
					<b>{{companyData?.[companyFieldsList[0]]}}</b>
				</p>
				<p v-for="(field) in companyFieldsList.slice(1)" v-show="companyData?.[field]" class="mb-1">
					{{formatCamelCaseToText(field)}}: <b>{{companyData?.[field]}}</b>
				</p>

			</div>
		</div>
	</div>

	<div class="is-divider has-border-color-turquoise"></div>

	<div class="invoiceBody">

		<div class="columns is-mobile">
			<div class="column">
				
				<p class="is-size-6 is-turquoise"><b>INVOICE / FACTURĂ</b></p>
				
				<p class="">
					Invoice-Number: <b>{{invoiceData.number}}</b>
				</p>
				<p class="">
					Invoice-Date(dd.mm.yyyy): <b>{{ (new Date(invoiceData.date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}</b>
				</p>

				<p class="">
					Due-Date(dd.mm.yyyy): <b>{{ (new Date(invoiceData.dueDate || invoiceData.due_date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}</b>
				</p>

			</div>
			<div class="column is-one-fifth"></div>
			<div class="column">
				
				<p class="is-size-7 "><b>Buyer / Cumpărător:</b></p>
				
				<p class="is-size-6 is-turquoise" v-show="buyerData?.[buyerFieldsList[0]]">
					<b>{{buyerData?.[buyerFieldsList[0]]}}</b>
				</p>
				<p v-for="(field) in buyerFieldsList.slice(1)" v-show="buyerData?.[field]" class="mb-1">
					{{formatCamelCaseToText(field)}}: <b>{{buyerData?.[field]}}</b>
				</p>

			</div>
		</div>

		
		<div class="table-container">
			<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth has-text-centered">
				<thead>
					<tr>
						<th align>Pos no.</th>
						<th align>Description<br />(Denumirea produselor sau a serviciilor)</th>
						<th align>Unit<br />(U.M.)</th>
						<th align>Quantity<br />(Cantitate)</th>
						<th align>
							Unit price
							<br />
							(-{{currenciesList[invoiceData.currency].label}}-)
							<template v-if="invoiceData.currency != 'ron'">
								<br />
								<small>(-ron-)</small>
							</template>
						</th>
						<th align>
							Total Amount
							<br />
							(-{{currenciesList[invoiceData.currency].label}}-)
							<template v-if="invoiceData.currency != 'ron'">
								<br />
								<small>(-ron-)</small>
							</template>
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(product, index) in invoiceData.products">
						<td>{{index+1}}</td>
						<td><div style="max-width: 350px;margin: 0 auto; white-space: pre-line;text-align: left;" v-html="product.name.replaceAll(' ','&nbsp;')"></div></td>
						<td>{{product.unit}}</td>
						<td>{{product.qty}}</td>
						<td>
							<b>{{beautifyNumber(product.amount)}}</b>
							<template v-if="invoiceData.currency != 'ron'">
								<br />
								<small>({{beautifyNumber(product.amount * invoiceData.rate)}})</small>
							</template>
						</td>
						<td>
							<b>{{beautifyNumber(product.qty * product.amount)}}</b>
							<template v-if="invoiceData.currency != 'ron'">
								<br />
								<small>({{beautifyNumber(product.qty * product.amount * invoiceData.rate)}})</small>
							</template>
						</td>
					</tr> 

					<tr>
						<td colspan="5">
							<span><b>Invoice Total -{{currenciesList[invoiceData.currency].label}}-</b>  </span>
							<br />
							<small><i>(Valoare totală de plată factura curentă -RON-)</i></small>
						</td>
						<td>
							<b>{{beautifyNumber( invoiceData.products.reduce(function (total, product) { return total + (product.qty * product.amount); }, 0) )}}</b>
							<template v-if="invoiceData.currency != 'ron'">
								<br />
								<small>({{beautifyNumber( invoiceData.products.reduce(function (total, product) { return total + (product.qty * product.amount * invoiceData.rate); }, 0) )}})</small>
							</template>
						</td>
					</tr>
				</tbody>
			
			</table>
		</div>

	</div>
	
	<div className="invoiceFooter">
			
		<div className="columns is-gapless is-multiline is-mobile">

			<div v-for="(field) in companyFieldsList" class="column is-one-third pr-2">
				<p><small>{{field != 'companyName' ? formatCamelCaseToText(field) + ': ' : ''}}{{companyData?.[field]}}</small></p>
			</div>

		</div>

	</div>

</div>
	`,
	data() {

		return {

		}
		
	},
	props: {
		companyData: Object,
		companyFieldsList: Array,
		buyerData: Object,
		buyerFieldsList: Array,
		invoiceData: Object,
		currenciesList: Object
	},
	methods:{

		formatCamelCaseToText: function(sText){
			
			const sFormatText = sText.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
			
			return sFormatText.charAt(0).toUpperCase() + sFormatText.slice(1);

		},
		beautifyNumber(number){

			if( (typeof number == 'number') && !isNaN(number) && !Number.isInteger(number) ){
				number = number.toFixed(2);
			}
			return (number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		}
	}
}