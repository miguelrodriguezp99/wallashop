package es.udc.fi.dc.fd.rest.dtos;

import java.util.List;
import java.util.stream.Collectors;

import es.udc.fi.dc.fd.model.entities.Category;

public class CategoryConverter {
	public static CategoryDto toDto(Category category) {
		CategoryDto dto = new CategoryDto();
		dto.setId(category.getId());
		dto.setName(category.getName());
		return dto;
	}

	public static Category toEntity(CategoryDto dto) {
		Category category = new Category();
		category.setId(dto.getId());
		category.setName(dto.getName());
		return category;
	}

	public static List<CategoryDto> toDtoList(List<Category> categoryList) {
		return categoryList.stream().map(p -> toDto(p)).collect(Collectors.toList());
	}

}