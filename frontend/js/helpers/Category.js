const CATEGORY_API_PATH = "categories";

$(async () => {
    //for initial loading, set categories to select box
    const categorySelect = $("#category-select");
    const categories = await Get(CATEGORY_API_PATH);
    //set default value
    categorySelect.append(`<option value="-1">---</option>`);
    categories.forEach((category) => {
        categorySelect.append(
            `<option value=${category.id}>${category.name}</option>`
        );
    });

    $("#category-add-button").click(async function () {
        const categoryInput = $("#category-input");
        // return when input is empty
        if (categoryInput.val().trim() === "") {
            return;
        }
        const result = await Post(CATEGORY_API_PATH, {
            newCategory: categoryInput.val(),
        });

        //show result in UI and handle server error
        if (!showNotification(result)) {
            return;
        }

        //add newly added category to select box
        categorySelect.append(
            `<option value=${result.id}>${result.name}</option>`
        );

        //clear input
        categoryInput.val("");
        $(this).attr("disabled", true);
    });
});
