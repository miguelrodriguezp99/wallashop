package es.udc.fi.dc.fd.rest.dtos;

public class SocketAnswerDto {
    private boolean success;
    private String userId;

    // Constructores, getters y setters

    public SocketAnswerDto() {
        // Constructor por defecto necesario para la deserialización JSON
    }

    public SocketAnswerDto(boolean success, String userId) {
        this.success = success;
        this.userId = userId;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
