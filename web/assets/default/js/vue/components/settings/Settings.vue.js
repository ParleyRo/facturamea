import CompaniesList from "../company/CompaniesList.vue.js";
import CompanyForm from "../company/CompanyForm.vue.js";

import BuyersList from "../company/CompaniesList.vue.js";
import BuyerForm from "../company/CompanyForm.vue.js";

export default {
	template: `
<div>
	<div class="tabs is-centered is-boxed is-orange">
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
			:companyData="company" 
		/>

		<div class="is-divider" data-content="Add or Edit companies bellow"></div>

		<CompanyForm 
			v-on:submited="add"
			:companyData="company"
		/>
	</div>

	<div v-if="tabActive =='buyer'">

		<BuyersList 
			:companyData="buyer" 
		/>
		
		<div class="is-divider" data-content="Add or Edit companies bellow"></div>

		<BuyerForm 
			v-on:submited="add"
			:companyData="buyer"
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
				selected: "",
				fields: JSON.parse(this.availableFieldsCompany),
				list: JSON.parse(this.companiesData),
				label: "company",
			},
			buyer:{
				selected: "",
				fields: JSON.parse(this.availableFieldsBuyer),
				list: JSON.parse(this.buyersData),
				label: "buyer",
			}
		}
		
	},
	methods:{
		tabbSetActive: function(tabName){
			this.tabActive = tabName;
		},
		add: function({type,data}){
			
			data.data = JSON.parse(data.data);
			
			this[type].list[data.id] = data;
			this[type].selected = data.id;
			
		}
	},
	components: {
		CompaniesList,
		CompanyForm,
		BuyersList,
		BuyerForm
	}
}