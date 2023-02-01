export default {
	template: `
		<div class="field">
  			<label class="label">Select your invoice</label>
			<div class="control">
				<div class="select is-fullwidth">
					<select v-model="invoice.selected" >
						
						<option value="">Nothing selected</option>
						<option 
							v-for="invoiceItem in invoice.list"
							:key="invoiceItem.id"
							:value="invoiceItem.id"
						>
							{{invoiceItem.number}} - {{ (new Date(invoiceItem.date)).toLocaleDateString('ro-RO',{year: "numeric", month: "numeric", day: "numeric"}) }}
						</option>

					</select>
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			invoice: this.invoiceData,
		}
			
	},
	props: {
		invoiceData: Object,
	}

}