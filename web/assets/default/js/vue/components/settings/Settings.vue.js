import CompaniesList from "../company/CompaniesList.vue.js";
import CompanyForm from "../company/CompanyForm.vue.js";

import BuyersList from "../company/CompaniesList.vue.js";
import BuyerForm from "../company/CompanyForm.vue.js";

export default {
	template: `
		
		<div class="container is-fullhd px-4">

			<div class="tabs is-centered is-boxed">
				<ul>
					<li :class="[tabActive =='company' ? 'is-active' : '']">
						<a v-on:click="tabbSetActive('company')">
							<span class="icon is-small"><i class="fas fa-file-invoice" aria-hidden="true"></i></span>
							<span>Your company</span>
						</a>
					</li>
					<li :class="[tabActive =='buyer' ? 'is-active' : '']">
						<a v-on:click="tabbSetActive('buyer')">
							<span class="icon is-small"><i class="fas fa-file-invoice-dollar" aria-hidden="true"></i></span>
							<span>Buyer</span>
						</a>
					</li>
					
				</ul>
			</div>
			
			<div v-if="tabActive =='company'">
				<CompaniesList 
					v-on:changed="changed"
					:companiesData="company.list" 
					:select="company.selected"
					:type="'company'"
				/>

				<div class="is-divider" data-content="Add or Edit companies bellow"></div>

				<CompanyForm 
					v-on:submited="add"
					:data="company.formData"
					:fieldsNames="company.fields"
					:type="'company'"
				/>
			</div>

			<div v-if="tabActive =='buyer'">
				<BuyersList 
					v-on:changed="changed"
					:companiesData="buyer.list" 
					:select="buyer.selected"
					:type="'buyer'"
				/>
				
				<BuyerForm 
					v-on:submited="add"
					:data="buyer.formData"
					:fieldsNames="buyer.fields"
					:type="'buyer'"
				/>
			</div>
			
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
			tabActive: 'company',
			company:{
				formData: {},
				selected: "",
				fields: JSON.parse(this.availableFieldsCompany),
				list: JSON.parse(this.companiesData)
			},
			buyer:{
				formData: {},
				selected: "",
				fields: JSON.parse(this.availableFieldsBuyer),
				list: JSON.parse(this.buyersData)
			}
		}
		
	},
	methods:{
		tabbSetActive: function(tabName){
			this.tabActive = tabName;
		},
		add: function({type,data}){
			data.data = JSON.parse(data.data);
			
			this[type].list[data.name] = data;
			this[type].selected = data.name;
			
		},
		changed: function({type,companyName}){

			this[type].formData = this[type].list[companyName]?.data || {};
			this[type].selected = companyName;
		}
	},
	components: {
		CompaniesList,
		CompanyForm,
		BuyersList,
		BuyerForm
	}
}