import CompaniesList from "../company/CompaniesList.vue.js";
import BuyersList from "../company/CompaniesList.vue.js";

import InvoiceRender from "./InvoiceRender.vue.js";
import InvoiceData from "./InvoiceData.vue.js";

export default {
	template: `
		
		<div class="container is-fullhd px-4">

			<div class="columns is-mobile is-justify-content-center">
				
				<div class="column is-one-quarter-desktop is-one-quarter-tablet is-half-mobile pr-1">
					<CompaniesList 
						v-on:changed="changed"
						:companiesData="company.list" 
						:select="company.selected"
						:type="'company'"
					/>
				</div>
				
				<div class="column is-one-quarter-desktop is-one-quarter-tablet is-half-mobile">
					<BuyersList 
						v-on:changed="changed"
						:companiesData="buyer.list" 
						:select="buyer.selected"
						:type="'buyer'"
					/>
				</div>

			</div>
			
			<div class="is-divider" data-content="Invoice data"></div>

			<InvoiceData 
				:invoiceData="invoice"
			/>

			<div class="is-divider" data-content="Invoice rendered"></div>

			<div class="columns is-mobile is-justify-content-center is-align-items-end is-multiline">
				<div class="column is-7">
					<div class="buttons is-justify-content-flex-end">
						<button class="button is-info" v-on:click="add">Save Invoice</button>
						<button class="button is-primary" v-on:click="printToPdf">Print To Pdf</button>
					</div>
				</div>
			</div>
			
			
			<div id="invoice-render">
				<InvoiceRender
					:companyData="company.list[company.selected]?.data"
					:companyFieldsList="company.fields"
					:buyerData="buyer.list[buyer.selected]?.data"
					:buyerFieldsList="buyer.fields"
					:invoiceData="invoice"
				/>
			</div>
		</div>
	`,
	props: {
		companiesData: String,
		buyersData: String,
		availableFieldsCompany: String,
		availableFieldsBuyer: String,
		availableCurrencies: String
	},
	data() {

		const dueDateTime = 864000 * 1000;

		return {
			company:{
				selected: "",
				list: JSON.parse(this.companiesData),
				fields: JSON.parse(this.availableFieldsCompany),
			},
			buyer:{
				selected: "",
				list: JSON.parse(this.buyersData),
				fields: JSON.parse(this.availableFieldsBuyer),
			},
			invoice:{
				date: new Date(),
				dueDate: new Date(Date.now() + dueDateTime ),
				number: '',
				dueDateTime: dueDateTime,
				currencies:{
					list: JSON.parse(this.availableCurrencies),
					selected: 'ron'
				},
				products: [
					{
						name: '',
						qty: 1,
						amount: 0
					}
				]
			}
		}
		
	},
	methods:{
		changed: function({type,companyName}){

			this[type].selected = companyName;
		},
		add: async function(){

			const oData = {
				id_company: this.company.list[this.company.selected].id,
				id_buyer: this.buyer.list[this.buyer.selected].id,
				number: this.invoice.number,
				currency: this.invoice.currencies.selected,
				date: this.invoice.date.getTime(),
				due_date: this.invoice.dueDate.getTime(),
				products: this.invoice.products
			}

			const response = await fetch('/invoice/add',{
				method: 'post',
				body: JSON.stringify(oData),
				headers: {'Content-Type': 'application/json'}
			});
			
			const data = await response.json();

		},
		printToPdf: function(){
			
			var pdfContent = document.querySelector('#invoice-render').innerHTML;
			var pdfTemplate = `<html><head>${document.head.innerHTML}</head><body>${pdfContent}</body></html>`;
			
			// var windowObject = window.open('',"ModalPopUp","toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,left = 490,top=300");
			
			var windowObject = window.open();

			windowObject.document.write(pdfTemplate);

			setTimeout(() => {
				windowObject.print();
				windowObject.close();
			}, 250);
			
		}

	},
	components: {
		CompaniesList,
		BuyersList,
		InvoiceRender,
		InvoiceData
	}
	
}