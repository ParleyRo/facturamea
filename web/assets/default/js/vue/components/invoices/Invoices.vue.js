import InvoiceRender from "../invoice/InvoiceRender.vue.js";

export default {
	template: `
		
<div>
	
	<div class="invoices columns is-multiline is-mobile is-justify-content-center">
		<div v-for="invoiceItem in invoicesData" v-on:click="toggleActive" :key="invoiceItem.id" class="invoiceItem column is-full-mobile is-half-tablet is-one-third-desktop ">
			<div class="invoiceActions" >
				<div class="buttons is-justify-content-flex-end">
					<button class="button is-danger" v-on:click="deleteInvoice(invoiceItem.id,$event)">Delete</button>
					<button class="button is-info" v-on:click="printToPdf">Print To Pdf</button>
				</div>
			</div>
			<div class="invoiceContainer custom-scroll scroll-x">
				<h1 class="has-text-centered pt-1">{{invoiceItem.number}} - {{ (new Date(invoiceItem.date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}</h1>
				<InvoiceRender
					:companyData="companiesData[invoiceItem.id_company]?.data"
					:companyFieldsList="availableFieldsCompany"
					:buyerData="buyersData[invoiceItem.id_buyer]?.data"
					:buyerFieldsList="availableFieldsBuyer"
					:invoiceData="invoiceItem"
					:currenciesList="availableCurrencies"
				/>
			</div>
		</div>
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
	methods:{
		toggleActive(e){

			if(e.target.closest('.invoiceActions') != null){
				return;
			}
			document.querySelectorAll('.invoiceItem.is-active').forEach(function(invoiceItem) {
				if(e.currentTarget != invoiceItem){
					invoiceItem.classList.toggle('is-active')
				}
			});

			e.target.closest('.invoiceItem').classList.toggle("is-active");
		},
		printToPdf(e){
			
			const invoiceItem = e.target.closest('.invoiceItem');

			invoiceItem.getElementsByTagName('h1')[0].classList.add("is-hidden");
			
			var pdfContent = invoiceItem.innerHTML;
			var pdfTemplate = `<html><head>${document.head.innerHTML}</head><body>${pdfContent}</body></html>`;
						
			var windowObject = window.open();

			windowObject.document.write(pdfTemplate);

			setTimeout(() => {
				windowObject.print();
				windowObject.close();
				invoiceItem.getElementsByTagName('h1')[0].classList.remove("is-hidden");
			}, 250);
		},
		async deleteInvoice(id, e){

			if (confirm("Are you sure?") != true) {
				return;
			}

			const response = await fetch(`/invoice/${id}`,{
				method: 'delete',
				headers: {'Content-Type': 'application/json'}
			});

			const data = await response.json();

			if(data.state === 'success'){
				e.target.closest('.invoiceItem').remove();
			}

		}
	},
	components: {
		InvoiceRender
	}
	
}