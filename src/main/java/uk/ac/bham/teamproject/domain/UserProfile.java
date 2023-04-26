package uk.ac.bham.teamproject.domain;

import java.io.IOException;
import java.io.Serializable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.persistence.*;
import javax.validation.constraints.*;
import okhttp3.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "firstnames", length = 20, nullable = false)
    private String firstnames;

    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "lastname", length = 20, nullable = false)
    private String lastname;

    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "language", nullable = false)
    private String language;

    @NotNull
    @Column(name = "verified", nullable = false)
    private Boolean verified;

    @NotNull
    @Column(name = "private_account", nullable = false)
    private Boolean privateAccount;

    @NotNull
    @Column(name = "age", nullable = false)
    private Integer age;

    @NotNull
    @Column(name = "account_type", nullable = false)
    private String accountType;

    @NotNull
    @Size(min = 3, max = 20)
    @Column(name = "occupation", length = 20, nullable = false)
    private String occupation;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "city")
    private String city;

    @NotNull
    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    @Size(min = 1, max = 150)
    @Column(name = "bio", length = 150)
    private String bio;

    @NotNull
    @Size(min = 11)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "community_points")
    private Integer communityPoints;

    @NotNull
    @Column(name = "g_ps", nullable = false)
    private Boolean gPS;

    @Column(name = "darkmode")
    private Boolean darkmode;

    @Column(name = "fontsize")
    private Integer fontsize;

    @OneToOne
    @JoinColumn(unique = true)
    private User userID;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public UserProfile username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstnames() {
        return this.firstnames;
    }

    public UserProfile firstnames(String firstnames) {
        this.setFirstnames(firstnames);
        return this;
    }

    public void setFirstnames(String firstnames) {
        this.firstnames = firstnames;
    }

    public String getLastname() {
        return this.lastname;
    }

    public UserProfile lastname(String lastname) {
        this.setLastname(lastname);
        return this;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPassword() {
        return this.password;
    }

    public UserProfile password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public UserProfile email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLanguage() {
        return this.language;
    }

    public UserProfile language(String language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getVerified() {
        return this.verified;
    }

    public UserProfile verified(Boolean verified) {
        this.setVerified(verified);
        return this;
    }

    public void setVerified(Boolean verified) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");
        RequestBody body = RequestBody.create(mediaType, "type=document");
        Request request = new Request.Builder()
            .url("https://api.stripe.com/v1/identity/verification_sessions")
            .post(body)
            .addHeader(
                "Authorization",
                "Bearer sk_test_51Mrk2UEec5lmlBUDz2OveUQ6CpCzct3haH4HImKbnXgqLPvoNw43klXM0GVY0BhhnWQX6idgum2YY6oEwr327sUp00P7LB1pqO"
            )
            .build();

        try (Response responses = client.newCall(request).execute()) {
            String responseBody = responses.toString();
            Pattern pattern = Pattern.compile("\"url\":\\s*\"(.*?)\"");
            Matcher matcher = pattern.matcher(responseBody);
            if (matcher.find()) {
                String url = matcher.group(1);
                ProcessBuilder pb = new ProcessBuilder("x-www-browser", url);
                pb.start();
            }
        } catch (IOException e) {
            // Handle the exception here
        }

        this.verified = false;
    }

    public Boolean getPrivateAccount() {
        return this.privateAccount;
    }

    public UserProfile privateAccount(Boolean privateAccount) {
        this.setPrivateAccount(privateAccount);
        return this;
    }

    public void setPrivateAccount(Boolean privateAccount) {
        this.privateAccount = privateAccount;
    }

    public Integer getAge() {
        return this.age;
    }

    public UserProfile age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAccountType() {
        return this.accountType;
    }

    public UserProfile accountType(String accountType) {
        this.setAccountType(accountType);
        return this;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getOccupation() {
        return this.occupation;
    }

    public UserProfile occupation(String occupation) {
        this.setOccupation(occupation);
        return this;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public UserProfile streetAddress(String streetAddress) {
        this.setStreetAddress(streetAddress);
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return this.city;
    }

    public UserProfile city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public UserProfile postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getBio() {
        return this.bio;
    }

    public UserProfile bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public UserProfile phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getCommunityPoints() {
        return this.communityPoints;
    }

    public UserProfile communityPoints(Integer communityPoints) {
        this.setCommunityPoints(communityPoints);
        return this;
    }

    public void setCommunityPoints(Integer communityPoints) {
        this.communityPoints = communityPoints;
    }

    public Boolean getgPS() {
        return this.gPS;
    }

    public UserProfile gPS(Boolean gPS) {
        this.setgPS(gPS);
        return this;
    }

    public void setgPS(Boolean gPS) {
        this.gPS = gPS;
    }

    public Boolean getDarkmode() {
        return this.darkmode;
    }

    public UserProfile darkmode(Boolean darkmode) {
        this.setDarkmode(darkmode);
        return this;
    }

    public void setDarkmode(Boolean darkmode) {
        this.darkmode = darkmode;
    }

    public Integer getFontsize() {
        return this.fontsize;
    }

    public UserProfile fontsize(Integer fontsize) {
        this.setFontsize(fontsize);
        return this;
    }

    public void setFontsize(Integer fontsize) {
        this.fontsize = fontsize;
    }

    public User getUserID() {
        return this.userID;
    }

    public void setUserID(User user) {
        this.userID = user;
    }

    public UserProfile userID(User user) {
        this.setUserID(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", firstnames='" + getFirstnames() + "'" +
            ", lastname='" + getLastname() + "'" +
            ", password='" + getPassword() + "'" +
            ", email='" + getEmail() + "'" +
            ", language='" + getLanguage() + "'" +
            ", verified='" + getVerified() + "'" +
            ", privateAccount='" + getPrivateAccount() + "'" +
            ", age=" + getAge() +
            ", accountType='" + getAccountType() + "'" +
            ", occupation='" + getOccupation() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", city='" + getCity() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", bio='" + getBio() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", communityPoints=" + getCommunityPoints() +
            ", gPS='" + getgPS() + "'" +
            ", darkmode='" + getDarkmode() + "'" +
            ", fontsize=" + getFontsize() +
            "}";
    }
}
