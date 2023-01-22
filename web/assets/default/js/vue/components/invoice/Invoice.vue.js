import CompaniesList from "../company/CompaniesList.vue.js";
import BuyersList from "../company/CompaniesList.vue.js";

export default {
	template: `
		
		<div class="container is-fullhd px-4">
			<div class="columns is-gapless is-mobile">
				
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

		</div>
	`,
	props: {
		companiesData: String,
		buyersData: String,
	},
	data() {

		return {
			company:{
				selected: "",
				list: JSON.parse(this.companiesData)
			},
			buyer:{
				selected: "",
				list: JSON.parse(this.buyersData)
			}
		}
		
	},
	methods:{
		changed: function({type,companyName}){

			this[type].selected = companyName;
		}
	},
	components: {
		CompaniesList,
		BuyersList
	}
}