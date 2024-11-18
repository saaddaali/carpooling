package ma.zyn.app.bean.core.driver;


import java.time.LocalDateTime;


import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;




import com.fasterxml.jackson.annotation.JsonInclude;
import ma.zyn.app.zynerator.bean.BaseEntity;
import jakarta.persistence.*;
import java.util.Objects;
import java.math.BigDecimal;
import ma.zyn.app.zynerator.security.bean.User;

@Entity
@Table(name = "driver")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="driver_seq",sequenceName="driver_seq",allocationSize=1, initialValue = 1)
public class Driver  extends User    {


    public Driver(String username) {
        super(username);
    }


    @Column(length = 500)
    private String photo;

    private String adresse;

    private LocalDateTime dateInscription ;

    private BigDecimal evaluation = BigDecimal.ZERO;











    public Driver(){
        super();
    }

    public Driver(Long id){
        this.id = id;
    }

    public Driver(Long id,String email){
        this.id = id;
        this.email = email ;
    }




    @Id
    @Column(name = "id")
    @GeneratedValue(strategy =  GenerationType.SEQUENCE,generator="driver_seq")
      @Override
    public Long getId(){
        return this.id;
    }
        @Override
    public void setId(Long id){
        this.id = id;
    }
    public String getPhoto(){
        return this.photo;
    }
    public void setPhoto(String photo){
        this.photo = photo;
    }
      @Column(columnDefinition="TEXT")
    public String getAdresse(){
        return this.adresse;
    }
    public void setAdresse(String adresse){
        this.adresse = adresse;
    }
    public LocalDateTime getDateInscription(){
        return this.dateInscription;
    }
    public void setDateInscription(LocalDateTime dateInscription){
        this.dateInscription = dateInscription;
    }
    public BigDecimal getEvaluation(){
        return this.evaluation;
    }
    public void setEvaluation(BigDecimal evaluation){
        this.evaluation = evaluation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Driver driver = (Driver) o;
        return id != null && id.equals(driver.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

