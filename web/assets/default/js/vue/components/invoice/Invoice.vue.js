import CompaniesList from "../company/CompaniesList.vue.js";
import BuyersList from "../company/CompaniesList.vue.js";

import InvoiceRender from "./InvoiceRender.vue.js";

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
			
			{{invoice.date?.toLocaleDateString()}}
			<button v-on:change="dateChange" ref='calendarTrigger' type='button'>Change</button>
			
			<InvoiceRender
				:companyData="company.list[company.selected]?.data"
				:companyFieldsList="company.fields"
				:buyerData="buyer.list[buyer.selected]?.data"
				:buyerFieldsList="buyer.fields"
			/>
			
		
		</div>
	`,
	props: {
		companiesData: String,
		buyersData: String,
		availableFieldsCompany: String,
		availableFieldsBuyer: String
	},
	data() {

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
				date: new Date()
			}
		}
		
	},
	methods:{
		changed: function({type,companyName}){

			this[type].selected = companyName;
		},
		dateChange: function(){
			console.log(1)
		}
	},
	components: {
		CompaniesList,
		BuyersList,
		InvoiceRender
	},
	mounted() {
		const calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
			startDate: this.invoice.date,
			dateFormat: "dd-MM-yyyy",
			type: 'date'
		})[0];
		var self=this;
		// calendar.on('select', function(e){
		// 	console.log(e.data.date.start)
		// 	self.invoice.date = e.data.date.start || null
		// })
	}
	
}