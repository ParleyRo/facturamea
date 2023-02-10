import CompaniesList from "../company/CompaniesList.vue.js";
import BuyersList from "../company/CompaniesList.vue.js";

import InvoiceRender from "./InvoiceRender.vue.js";
import InvoiceData from "./InvoiceData.vue.js";
import InvoicesList from "../invoices/InvoicesList.vue.js";

export default {
	template: `
		
<div>

	<div class="columns is-justify-content-center">
		
		<div class="column is-3">
			<CompaniesList 
				:companyData="company"
			/>
		</div>
		
		<div class="column is-4">
			<BuyersList 
				:companyData="buyer" 
			/>
		</div>

		<div class="column is-3">
			<InvoicesList 
				:invoiceData="invoices" 
			/>
		</div>

	</div>
	
	<div class="is-divider" data-content="Invoice data"></div>

	<InvoiceData 
		:invoiceData="invoice"
		:currenciesList="currencies"
	/>

	<div class="is-divider" data-content="Invoice rendered"></div>

	<div class="columns is-justify-content-center is-align-items-end is-multiline">
		<div class="column is-10">
			<div class="buttons is-justify-content-flex-end">
				<button :disabled="saveDisabled" class="button is-info is-outlined" v-on:click="add">Save Invoice</button>
				<button class="button is-info" v-on:click="printToPdf">Print To Pdf</button>
			</div>
		</div>
	</div>
	
	
	<div id="invoice-render" class="scroll-x">
		<InvoiceRender
			:companyData="company.list[company.selected]?.data"
			:companyFieldsList="company.fields"
			:buyerData="buyer.list[buyer.selected]?.data"
			:buyerFieldsList="buyer.fields"
			:invoiceData="invoice"
			:currenciesList="currencies"
		/>
	</div>
</div>
	`,
	props: {
		invoicesData: Object,
		companiesData: Object,
		buyersData: Object,
		availableFieldsCompany: Array,
		availableFieldsBuyer: Array,
		availableCurrencies: Object
	},
	data() {

		const dueDateTime = 864000 * 1000;

		return {
			saveDisabled: true,
			invoices:{
				selected: "",
				list: this.invoicesData,
			},
			company:{
				selected: "",
				list: this.companiesData,
				fields: this.availableFieldsCompany,
				label: "company"
			},
			buyer:{
				selected: "",
				list: this.buyersData,
				fields: this.availableFieldsBuyer,
				label: "buyer"
			},
			currencies: this.availableCurrencies,
			invoice:{
				date: new Date(),
				dueDate: new Date(Date.now() + dueDateTime ),
				number: '',
				dueDateTime: dueDateTime,
				currency: 'ron',
				rate: 1,
				products: [
					{
						name: '',
						unit: 'buc',
						qty: 1,
						amount: 0
					}
				]
			}
		}
		
	},
	watch:{
		invoice:{
			deep: true,
			handler(newValue, oldValue) {
				this.saveDisabled = false;
			}
		},
		'invoice.currency': async function(newVal, oldVal){

			if(this.invoice.currency === 'ron'){
				return;
			}

			if(newVal === oldVal){
				return;
			}
			
			this.invoice.rate = 0;
			const oDataCurrency = await this.getCurrency({
				year: this.invoice.date.getFullYear(),
				month: this.invoice.date.getMonth()+1,
				day: this.invoice.date.getDate(),
				currency: this.invoice.currency
			})

			this.invoice.rate = oDataCurrency.rate
		},
		'invoice.date': async function(newVal, oldVal){
			
			if(this.invoice.currency === 'ron'){
				return;
			}

			if(newVal === oldVal){
				return;
			}

			this.invoice.rate = 0;
			
			const oDataCurrency = await this.getCurrency({
				year: newVal.getFullYear(),
				month: newVal.getMonth()+1,
				day: newVal.getDate(),
				currency: this.invoice.currency
			})

			this.invoice.rate = oDataCurrency.rate
		},
		invoices: {
			deep: true,
			handler(newValue, oldValue) {

				this.company.selected = newValue.list[newValue.selected]?.id_company || ''
				this.buyer.selected = newValue.list[newValue.selected]?.id_buyer || ''

				this.invoice.number = newValue.list[newValue.selected]?.number || ''
				this.invoice.currency = newValue.list[newValue.selected]?.currency || 'ron'
				
				this.invoice.date = new Date(newValue.list[newValue.selected]?.date || new Date())
				document.getElementById('invoiceDate').bulmaCalendar.date.start = this.invoice.date
				document.getElementById('invoiceDate').bulmaCalendar.save()

				this.invoice.dueDate = new Date(newValue.list[newValue.selected]?.due_date || (new Date()).getTime() + this.invoice.dueDateTime)
				document.getElementById('invoiceDueDate').bulmaCalendar.date.start = this.invoice.dueDate
				document.getElementById('invoiceDueDate').bulmaCalendar.save()

				this.invoice.products = newValue.list[newValue.selected]?.products || [{
					name: '',
					unit: 'buc',
					qty: 1,
					amount: 0
				}]
				
			}
		}
	},
	methods:{
		getCurrency: async function({year,month,day,currency}){
			const response = await fetch(`/cursbnr/${year}/${month}/${day}/${currency}`,{
				method: 'get',
				headers: {'Content-Type': 'application/json'}
			});
			
			const oData = await response.json();

			return oData
		},
		add: async function(){

			const found = Object.keys(this.invoices.list).find(key => this.invoices.list[key].number == this.invoice.number);
			
			if(found){
				if(!confirm(`Do you really want to update invoice with number ${this.invoice.number} ?`)){
					return;
				}	
			}

			const oData = {
				id_company: this.company.list[this.company.selected].id,
				id_buyer: this.buyer.list[this.buyer.selected].id,
				number: this.invoice.number,
				currency: this.invoice.currency,
				rate: this.invoice.rate,
				date: this.invoice.date.getTime(),
				due_date: this.invoice.dueDate.getTime(),
				products: this.invoice.products
			}

			const response = await fetch('/invoice',{
				method: 'post',
				body: JSON.stringify(oData),
				headers: {'Content-Type': 'application/json'}
			});
			
			const data = await response.json();
			
			if(data.data.id){
				this.invoices.list[data.data.id] = data.data;
				this.invoices.list[data.data.id].products = JSON.parse(this.invoices.list[data.data.id].products)
				this.invoices.selected = data.data.id;
			}
			this.saveDisabled = true;

		},
		printToPdf: function(){
			
			var pdfContent = document.querySelector('#invoice-render').innerHTML;
			var pdfTemplate = `<html><head>${document.head.innerHTML}</head><body>${pdfContent}</body></html>`;
			
			// var windowObject = window.open('',"ModalPopUp","toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,left = 490,top=300");
			
			var windowObject = window.open();

			windowObject.document.write(pdfTemplate);

			setTimeout(() => {
				windowObject.print();
				//windowObject.close();
			}, 250);
			
		}

	},
	components: {
		CompaniesList,
		BuyersList,
		InvoiceRender,
		InvoiceData,
		InvoicesList
	}
	
}