if(OS_ANDROID)
{
	$.customSearchBar.font = {
		fontSize : utility_lib.dpiConverter(18)
	};
	
	$.searchImg.width = utility_lib.dpiConverter(50);
	$.searchImg.height = utility_lib.dpiConverter(50);
	$.clearTextBtn.width = utility_lib.dpiConverter(28);
	$.clearTextBtn.height = utility_lib.dpiConverter(28);
	$.clearTextBtn.right = utility_lib.dpiConverter(30) + '%';
	$.customSearchBar.left = utility_lib.dpiConverter(12) + '%';
	$.customSearchBar.backgroundColor = "#000000";
	/*
	$.clearTextBtn.top= utility_lib.dpiConverter(15); 
	$.clearTextBtn.bottom=utility_lib.dpiConverter(15); 
	$.clearTextBtn.right=utility_lib.dpiConverter(15); 
	$.clearTextBtn.left= utility_lib.dpiConverter(15);
	*/
	
	$.customSearchBar.top = utility_lib.dpiConverter(15) + '%';
	$.customSearchBar.bottom = utility_lib.dpiConverter(15) + '%';
	
}
