package com.bookshare_backend.bookshare_backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Updateprofilerequest {
    @Size(min = 2, max = 100)
    private String name;
    private String phone;
    private String city;
    @Size(max = 500)
    private String bio;
	public Updateprofilerequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Updateprofilerequest(@Size(min = 2, max = 100) String name, String phone, String city,
			@Size(max = 500) String bio) {
		super();
		this.name = name;
		this.phone = phone;
		this.city = city;
		this.bio = bio;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getBio() {
		return bio;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}
}








