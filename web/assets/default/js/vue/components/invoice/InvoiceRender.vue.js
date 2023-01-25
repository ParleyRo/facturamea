export default {
	template: `
		<div class="scroll-x">
			
			<div class="invoiceContent">
				
				<div class="invoiceHeader">

					<div class="columns is-flex">

						<div class="column">
							<p class="is-size-4 has-color-turquoise" v-show="companyData?.[companyFieldsList[0]]">
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

					<div class="columns">
						<div class="column">
							
							<p class="is-size-6 has-color-turquoise"><b>INVOICE / FACTURĂ</b></p>
							
							<p class="">
								Invoice-Number: <b>{{invoiceData.number}}</b>
							</p>

							<p class="">
								Invoice-Date(dd.mm.yyyy): <b>{{invoiceData.date.toLocaleDateString(settings.date.locales,settings.date.options)}}</b>
							</p>

							<p class="">
								Due-Date(dd.mm.yyyy): <b>{{invoiceData.dueDate.toLocaleDateString(settings.date.locales,settings.date.options)}}</b>
							</p>

						</div>
						<div class="column is-one-fifth"></div>
						<div class="column">
							
							<p class="is-size-7 "><b>Buyer / Cumpărător:</b></p>
							
							<p class="is-size-6 has-color-turquoise" v-show="buyerData?.[buyerFieldsList[0]]">
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
									<th align>Unit price<br />(-{{invoiceData.currencies.list[invoiceData.currencies.selected].label}}-)</th>
									<th align>Total Amount<br />(-{{invoiceData.currencies.list[invoiceData.currencies.selected].label}}-)</th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="(product, index) in invoiceData.products">
									<td>{{index+1}}</td>
									<td>{{product.name}}</td>
									<td>{{product.qty}}</td>
									<td>{{product.amount}}</td>
									<td>{{product.qty * product.amount}}</td>
								</tr> 

								<tr>
									<td colspan="4">
										<span><b>Invoice Total -{{invoiceData.currencies.list[invoiceData.currencies.selected].label}}-</b>  </span>
										<br />
										<small><i>(Valoare totală de plată factura curentă -{{invoiceData.currencies.list[invoiceData.currencies.selected].label}}-)</i></small>
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
						
					<div className="columns is-gapless is-multiline">

						<div v-for="(field) in companyFieldsList" class="column is-one-third pr-2">
							<p><small>{{field != 'companyName' ? formatCamelCaseToText(field) + ': ' : ''}}{{companyData?.[field]}}</small></p>
						</div>

					</div>

				</div>

			</div>
		
		</div>

	`,
	data() {

		return {
			settings: {
				date: {
					locales: 'ro-RO',
					options: {
						year: "numeric",
						month: "numeric",
						day: "numeric",
					}
				}
			}
		}
		
	},
	props: {
		companyData: Object,
		companyFieldsList: Array,
		buyerData: Object,
		buyerFieldsList: Array,
		invoiceData: Object
	},
	methods:{

		formatCamelCaseToText: function(sText){
			
			const sFormatText = sText.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
			
			return sFormatText.charAt(0).toUpperCase() + sFormatText.slice(1);

		}
	}
}