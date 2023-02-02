export default {
	template: `
			<div class="invoiceContent">
				
				<div class="invoiceHeader">

					<div class="columns is-mobile">

						<div class="column">
							<p class="is-size-4 is-turquoise" v-show="companyData?.[companyFieldsList[0]]">
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
								Due-Date(dd.mm.yyyy): <b>{{ (new Date(invoiceData.dueDate)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}</b>
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
									<th align>Unit price<br />(-{{currenciesList[invoiceData.currency].label}}-)</th>
									<th align>Total Amount<br />(-{{currenciesList[invoiceData.currency].label}}-)</th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="(product, index) in invoiceData.products">
									<td>{{index+1}}</td>
									<td>{{product.name}}</td>
									<td>{{product.unit}}</td>
									<td>{{product.qty}}</td>
									<td>{{product.amount}}</td>
									<td>{{product.qty * product.amount}}</td>
								</tr> 

								<tr>
									<td colspan="5">
										<span><b>Invoice Total -{{currenciesList[invoiceData.currency].label}}-</b>  </span>
										<br />
										<small><i>(Valoare totală de plată factura curentă -{{currenciesList[invoiceData.currency].label}}-)</i></small>
									</td>
									<td>
										<b>{{invoiceData.products.reduce(function (total, product) { return total + (product.qty * product.amount); }, 0)}}</b>
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

		}
	}
}