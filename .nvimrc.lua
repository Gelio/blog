local markdown_formatting_group_id = vim.api.nvim_create_augroup("MarkdownFormatting", {})

vim.api.nvim_create_autocmd("BufEnter", {
	pattern = "*.mdx",
	group = markdown_formatting_group_id,
	callback = function()
		vim.bo.textwidth = 80

		vim.api.nvim_buf_create_user_command(0, "WordCount", "!wc -lw %", {})
	end,
})
