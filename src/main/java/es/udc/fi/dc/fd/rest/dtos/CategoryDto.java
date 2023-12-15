package es.udc.fi.dc.fd.rest.dtos;

public class CategoryDto {
	private Long id;
	private String name;

	public CategoryDto(String name) {
		super();
		this.name = name;
	}

	public CategoryDto() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
