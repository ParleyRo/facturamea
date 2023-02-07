export default {
	template: `
<div class="field">

	<label class="label">Select your invoice</label>

	<div 
		class="dropdown is-fullwidth"
		:class="[isActive ? 'is-active' : '']"
	>
		<div class="dropdown-trigger is-fullwidth">
			<button 
				v-on:click="dropdownToggleActive"
				class="button is-fullwidth" 
				aria-haspopup="true" 
				aria-controls="dropdown-menu"
			>
				<span>
					{{
						invoice.list[invoice.selected] == null 
						? 'Noting selected'
						: invoice.list[invoice.selected].number + ' - ' + (new Date(invoice.list[invoice.selected].date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"})
					}}
				</span>
				<span class="icon is-small">
					<i class="fa fa-angle-down" aria-hidden="true"></i>
				</span>
			</button>
			<input type="hidden" v-model="invoice.selected"/>
		</div>
		<div class="dropdown-menu pt-0" id="dropdown-menu" role="menu">
			
			<div class="dropdown-content pt-0">
				
				<div class="field dropdown-item">
					<div class="control has-icons-left">
						<input 
							v-on:keyup="handleTyping('searchByValue')"
							type="text" 
							placeholder="Search by number/date ..." 
							class="input is-transparent"
							v-model="searchValue"
						>
						<span class="icon is-left">
							<i class="fa fa-search"></i>
						</span>
					</div>
				</div>

				<hr class="dropdown-divider mt-0">
				<div class="custom-scroll scroll-y" style="max-height: 300px;">
					<template v-for="invoiceItem in invoice.list">   
						<a 
							class="dropdown-item"
							v-on:click="selecThisInvoice(invoiceItem.id)"
							v-show="showKeys.includes(invoiceItem.id)"
						>
							{{invoiceItem.number}} - {{ (new Date(invoiceItem.date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}
						</a>
					</template>
				</div>

			</div>

		</div>
	</div>
</div>
	`,
	data() {

		return {
			invoice: this.invoiceData,
			isActive: false,
			searchValue: '',
			showKeys: Object.keys(this.invoiceData.list),
			inputTypeTimer: null
		}
			
	},
	props: {
		invoiceData: Object,
	},
	watch:{
		invoiceData:{
			deep: true,
			handler(newValue, oldValue) {
				this.showKeys.push(newValue.selected)
			}
		}
	},
	methods: {
		selecThisInvoice: function(id){
			this.invoice.selected = id;
			this.isActive = false;
		},
		dropdownToggleActive: function(){
			this.isActive = !this.isActive
		},
		handleTyping: function(method){
			clearTimeout(this.inputTypeTimer);

			this.inputTypeTimer = setTimeout(() => {
				this[method]()
			}, 600);
		},
		searchByValue: async function(){

			this.searchValue = this.searchValue.trim();

			if((this.searchValue === '')){
				this.showKeys = Object.keys(this.invoice.list);
				return;
			}
			
			this.showKeys = [];

			for (const [key,invoiceItem] of Object.entries(this.invoice.list)) {

				if(invoiceItem.number == this.searchValue){
					this.showKeys.push(invoiceItem.id);
				}

				const oDate = new Date(invoiceItem.date);

				if(parseInt(oDate.getMonth())+1 == this.searchValue ){
					this.showKeys.push(invoiceItem.id);
				}
				if(oDate.getFullYear() == this.searchValue ){
					this.showKeys.push(invoiceItem.id);
				}

			}

			const response = await fetch(`invoices/search/${this.searchValue}`,{
				method: 'get',
				headers: {'Content-Type': 'application/json'}
			});

			const data = await response.json();

			if(data.state == 'success'){

				for (const [key,invoiceItem] of Object.entries(data.data)) {

					if(this.invoice.list[invoiceItem.id] == null){
						this.invoice.list[invoiceItem.id] = invoiceItem;
						this.showKeys.push(invoiceItem.id);
					}
				}
			}

		}
	}

}